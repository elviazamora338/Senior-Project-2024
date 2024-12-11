const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const multer = require('multer'); 
const fs = require("fs"); 
const { timeEnd } = require('console');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5001;
app.use(cors());
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json()); 

// Verify environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error("Error: EMAIL_USER and EMAIL_PASSWORD environment variables are required.");
    process.exit(1);
}

// Database connection setup
const db = new sqlite3.Database('SchedulerDB.db', (err) => {
    if (err) {
        console.error('Error connecting to the SQLite database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// Student submits a booking request to the owner of the device
app.post('/submitBookingRequest', (req, res) => {
    const { device_id, user_id, requested_date, requested_time, reason, owner_id } = req.body;
    console.log('Received a request at /submitBookingRequest');

    // Validate required fields
    if (!device_id || !user_id || !requested_date || !requested_time || !reason || !owner_id) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    console.log("Booking request received for Device ID:", device_id, "and User ID:", user_id);

    // Insert booking request into the "booking_requests" table
    const query = `
        INSERT INTO booking_requests (student_id, device_id, owner_id, request_time, request_date, status, reason)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const status = 'pending'; // Initial status is 'pending'

    db.run(query, [user_id, device_id, owner_id, requested_time, requested_date, status, reason], function(err) {
        if (err) {
            console.error('Error saving booking request:', err.message);
            return res.status(500).json({ error: 'Failed to save booking request' });
        }
    
        console.log('Booking request saved with Request ID:', this.lastID);
        res.json({ message: 'Booking request submitted successfully', requestId: this.lastID });
    });
});

// Fetch requests for the owner
app.get('/requests', (req, res) => {
    const { owner_id } = req.query;

    const query = `
    SELECT 
            br.schedule_id, 
            br.student_id, 
            br.device_id, 
            br.owner_id, 
            br.request_time, 
            br.request_date, 
            br.status, 
            br.reason,
            ld.device_name, -- Join to fetch device_name if needed
            u.user_name AS student_name, -- Join to fetch student details
            u.user_email AS student_email -- Join to fetch student email
        FROM booking_requests br
        LEFT JOIN lab_devices ld ON br.device_id = ld.device_id
        LEFT JOIN users u ON br.student_id = u.user_id
        WHERE br.owner_id = ?;
    `;

    db.all(query, [owner_id], (err, rows) => {
        if (err) {
            console.error('Error fetching requests:', err.message);
            return res.status(500).json({ error: 'Failed to fetch requests' });
        }
        res.json(rows);
    });
});

// Handle approving/rejecting requests
app.patch('/requests/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const updateQuery = `UPDATE booking_requests SET status = ? WHERE schedule_id = ?`;

    db.run(updateQuery, [status, id], function (err) {
        if (err) {
            console.error('Error updating request status:', err.message);
            return res.status(500).json({ error: 'Failed to update request status' });
        }

        if (status === 'approved') {
            const fetchQuery = `
                SELECT 
                    br.schedule_id,
                    br.student_id,
                    br.device_id,
                    br.owner_id,
                    br.request_time,
                    br.request_date,
                    br.reason,
                    ld.image_path
                FROM booking_requests br
                JOIN lab_devices ld ON br.device_id = ld.device_id
                WHERE br.schedule_id = ?
            `;

            db.get(fetchQuery, [id], (fetchErr, booking) => {
                if (fetchErr) {
                    console.error('Error fetching booking details:', fetchErr.message);
                    return res.status(500).json({ error: 'Failed to fetch booking details' });
                }

                // for history 
                if (booking) {
                    repeatedHistory(booking, (historyErr, action) => {
                        if (historyErr) {
                            return res.status(500).json({ error: 'Failed to process history' });
                        }
                        const message =
                            action === 'updated'
                                ? 'Request approved and history updated successfully'
                                : 'Request approved and added to history successfully';
                        res.json({ message });
                    });
                } else {
                    res.status(404).json({ error: 'Booking request not found' });
                }
            });
        } else {
            res.json({ message: 'Request status updated successfully' });
        }
    });
});


// Function to handle repeated history and FIFO
function repeatedHistory(booking, callback) {
    const checkQuery = `
        SELECT history_id 
        FROM history 
        WHERE student_id = ? AND device_id = ?
    `;

    db.get(checkQuery, [booking.student_id, booking.device_id], (err, row) => {
        if (err) {
            console.error('Error checking history:', err.message);
            return callback(err);
        }

        if (row) {
            // If record exists, update the booking_time and booking_date
            const updateQuery = `
                UPDATE history 
                SET booking_time = ?, booking_date = ? 
                WHERE history_id = ?
            `;
            db.run(updateQuery, [booking.request_time, booking.request_date, row.history_id], (updateErr) => {
                if (updateErr) {
                    console.error('Error updating history:', updateErr.message);
                    return callback(updateErr);
                }
                console.log('History updated successfully');
                return callback(null, 'updated');
            });
        } else {
            // If record doesn't exist, insert a new entry
            const insertQuery = `
                INSERT INTO history (schedule_id, student_id, device_id, owner_id, booking_time, booking_date, reason, image_path)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            db.run(
                insertQuery,
                [
                    booking.schedule_id,
                    booking.student_id,
                    booking.device_id,
                    booking.owner_id,
                    booking.request_time,
                    booking.request_date,
                    booking.reason,
                    booking.image_path || null,
                ],
                function (insertErr) {
                    if (insertErr) {
                        console.error('Error adding to history:', insertErr.message);
                        return callback(insertErr);
                    }
                    console.log('Booking added to history with History ID:', this.lastID);
                  // Enforce FIFO limit (delete oldest entry if count exceeds 10)
                    const countQuery = `SELECT COUNT(*) AS count FROM history`;
                    db.get(countQuery, (countErr, result) => {
                        if (countErr) {
                            console.error('Error counting history entries:', countErr.message);
                            return callback(countErr);
                        }

                        if (result.count > 10) {
                            const deleteQuery = `
                                DELETE FROM history 
                                WHERE history_id = (SELECT history_id FROM history ORDER BY history_id ASC LIMIT 1)
                            `;
                            db.run(deleteQuery, (deleteErr) => {
                                if (deleteErr) {
                                    console.error('Error deleting oldest history:', deleteErr.message);
                                    return callback(deleteErr);
                                }
                                console.log('Oldest history record deleted to maintain FIFO limit');
                                return callback(null, 'inserted');
                            });
                        } else {
                            return callback(null, 'inserted');
                        }
                  });
                }
            );
        }
    });
}

// Insert into unavailable table in the database to update the calendar
app.post('/unavailable', async (req, res) => {
    let unavailableItems = req.body;

    if (!Array.isArray(unavailableItems)) {
        if (typeof unavailableItems === 'object' && unavailableItems !== null) {
            unavailableItems = [unavailableItems]; 
        } else {
            return res.status(400).send({ error: 'Invalid data format. Expected an array of objects or a single object.' });
        }
    }

    try {
        const query = `
            INSERT INTO unavailable (time_range, owner_id, date, device_id, student_id, period)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        for (const item of unavailableItems) {
            const { time_range, owner_id, date, device_id, student_id, period} = item;

            if (!time_range || !owner_id || !date || !device_id || !period) {
                console.error('Missing fields in item:', item);
                continue; // Skip if required fields are missing
            }

            console.log("Values being inserted into database:", [time_range, owner_id, date, device_id, student_id || null, period]);

            await db.run(query, [time_range, owner_id, date, device_id, student_id, period]);
        }

        res.status(201).send({ message: 'Unavailability recorded successfully' });
    } catch (error) {
        console.error('Error inserting into unavailable table:', error.message);
        res.status(500).send({ error: 'Failed to add unavailability' });
    }
});




// Handle scheduled devices for student (or user) that booked the equipment 
app.get('/scheduled', async (req, res) => {
    const { student_id } = req.query; // Pass student_id as a query parameter


        const query = `
            SELECT 
                u.unavailability_id, 
                u.device_id, 
                d.image_path,
                d.device_name, 
                u.time_range, 
                u.date,
                u.period,
                u.owner_id,
                o.user_name AS owner_name
            FROM unavailable u
            JOIN lab_devices d ON u.device_id = d.device_id
            JOIN users o ON u.owner_id = o.user_id
            WHERE u.student_id = ?;
        `;
        
        db.all(query, [student_id], (err, rows) => {
        if (err) {
            console.error('Error fetching scheduled data:', err.message);
            res.status(500).send({ error: 'Failed to fetch scheduled data' });
        }
        res.json(rows);
    });
});

// Cancel scheduled
app.delete('/unavailable/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM unavailable WHERE unavailability_id = ?`;
        await db.run(query, [id]);
        res.status(200).send({ message: 'Unavailability canceled successfully' });
    } catch (error) {
        console.error('Error deleting unavailability:', error.message);
        res.status(500).send({ error: 'Failed to cancel unavailability' });
    }
});


// Fetch device details by device_id for Report_Equipment.jsx page
app.get('/device/:device_id', (req, res) => {
    const { device_id } = req.params;

    const query = `
        SELECT 
            ld.device_id,
            ld.device_name,
            ld.brand,
            ld.model,
            ld.description,
            ld.application,
            ld.category,
            ld.building,
            ld.room_number,
            ld.person_in_charge,
            ld.manual_link,
            ld.image_path,
            u.date,
            u.time_range,
            u.student_id,
            u.owner_id
        FROM lab_devices ld
        JOIN unavailable u ON ld.device_id = u.device_id
        WHERE ld.device_id = ?;
    `;

    db.get(query, [device_id], (err, row) => {
        if (err) {
            console.error('Error fetching device data:', err.message);
            return res.status(500).json({ error: 'Failed to fetch device data' });
        }
        if (!row) {
            console.log('No device found for ID:', device_id);
            return res.status(404).json({ error: 'Device not found' });
        }
        res.json(row);
    });
});

// Endpoint to fetch unavailable dates
app.get('/api/unavailableDates/:deviceId', (req, res) => {
    const { deviceId } = req.params;

    const query = 'SELECT date, time_range FROM unavailable WHERE device_id = ?';

    db.all(query, [deviceId], (err, rows) => {
        if (err) {
            console.error('Error fetching unavailable dates:', err.message);
            return res.status(500).json({ error: 'Failed to fetch unavailable dates' });
        }

        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: 'No unavailable dates found for this device' });
        }

        res.json(rows); // Send the result rows
    });
});


// Endpoint to fetch unavailable device
app.get('/unavailable/by-device/:device_id', (req, res) => {
    const { device_id } = req.params;

    const query = `
        SELECT unavailability_id
        FROM unavailable
        WHERE device_id = ?
    `;

    db.get(query, [device_id], (err, row) => {
        if (err) {
            console.error('Error fetching unavailability_id:', err.message);
            return res.status(500).json({ error: 'Failed to fetch unavailability_id.' });
        }

        if (!row) {
            return res.status(404).json({ error: 'No unavailability record found for this device.' });
        }

        res.json(row);
    });
});


// Fetch unavailable dates by device_id
app.get('/unavailable/:device_id', async (req, res) => {
    const { device_id } = req.params;

    if (!device_id) {
        return res.status(400).send({ error: 'device_id is required' });
    }

    try {
        const query = `
            SELECT period, date, time_range
            FROM unavailable
            WHERE device_id = ?
        `;

        db.all(query, [device_id], (err, rows) => {
            if (err) {
                console.error('Error fetching unavailable dates:', err.message);
                return res.status(500).send({ error: 'Failed to fetch unavailable dates' });
            }

            // Send the rows as the response
            res.status(200).send(rows);
        });
    } catch (error) {
        console.error('Error processing request:', error.message);
        res.status(500).send({ error: 'An error occurred while fetching unavailable dates' });
    }
});

// delete unavailable times when updating unavailability
app.delete('/current/unavailable/:device_id', async (req, res) => {
    const { device_id } = req.params;
    try {
        await db.run(`DELETE FROM unavailable WHERE device_id = ?`, [device_id]);
        res.status(200).send({ message: 'All unavailable times deleted successfully.' });
    } catch (error) {
        console.error('Error deleting unavailable times:', error);
        res.status(500).send({ error: 'Failed to delete unavailable times.' });
    }
});



app.post('/update/unavailable', async (req, res) => {
    const unavailableEntries = req.body;

    if (!Array.isArray(unavailableEntries)) {
        return res.status(400).send({ error: 'Invalid data format. Expected an array of objects.' });
    }

    const dbRun = (query, params) =>
        new Promise((resolve, reject) => {
            db.run(query, params, function (err) {
                if (err) reject(err);
                else resolve(this);
            });
        });

    try {
        // Start transaction
        await dbRun('BEGIN TRANSACTION');

        // Delete existing unavailable entries for the given device_id
        if (unavailableEntries.length > 0) {
            const device_id = unavailableEntries[0].device_id; // Assuming all entries have the same device_id
            await dbRun('DELETE FROM unavailable WHERE device_id = ?', [device_id]);
        }

        // Insert new unavailable entries
        const query = `
            INSERT INTO unavailable (date, period, time_range, device_id, owner_id)
            VALUES (?, ?, ?, ?, ?)
        `;

        for (const entry of unavailableEntries) {
            const { date, period, time_range, device_id, owner_id } = entry;

            if (!date || !device_id || !owner_id || !period || !time_range) {
                console.error('Missing fields in entry:', entry);
                continue; // Skip invalid entries
            }

            await dbRun(query, [date, period, time_range, device_id, owner_id]);
        }

        // Commit transaction
        await dbRun('COMMIT');
        res.status(201).send({ message: 'Unavailable entries updated successfully.' });
    } catch (error) {
        console.error('Error updating unavailable entries:', error.message);
        // Rollback transaction
        try {
            await dbRun('ROLLBACK');
        } catch (rollbackError) {
            console.error('Error rolling back transaction:', rollbackError.message);
        }
        res.status(500).send({ error: 'Failed to update unavailable entries.' });
    }
});




// Delete requests from my equipment page (owner page)
app.delete('/requests/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM booking_requests WHERE schedule_id = ?`;
        await db.run(query, [id]);
        res.status(200).send({ message: 'Booking request deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking request:', error.message);
        res.status(500).send({ error: 'Failed to delete booking request' });
    }
});


// Endpoint to save a report in the reports table
app.post('/reports', (req, res) => {
    const {
        device_id,
        device_name,
        owner_name,
        reporter_id,
        reporter_name,
        reporter_email,
        issue_description,
        status,
    } = req.body;

    // Validate required fields
    if (!device_id || !device_name || !owner_name || !reporter_id || !reporter_name || !reporter_email || !issue_description) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const defaultStatus = status || 'pending'; // Default to 'pending' if not provided

    const query = `
        INSERT INTO reports (device_id, device_name, owner_name, reporter_id, reporter_name, reporter_email, issue_description, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        query,
        [
            device_id,
            device_name,
            owner_name,
            reporter_id,
            reporter_name,
            reporter_email,
            issue_description,
            defaultStatus,
        ],
        function (err) {
            if (err) {
                console.error('Error inserting report:', err.message);
                return res.status(500).json({ error: 'Failed to save report.' });
            }
            res.json({ message: 'Report saved successfully.', reportId: this.lastID });
        }
    );
});


// Endpoint to fetch reports based on owner_name
app.get('/reports', (req, res) => {
    const { owner_name } = req.query;

    if (!owner_name) {
        return res.status(400).json({ error: 'Owner name is required.' });
    }

    const query = `
        SELECT reporter_name, reporter_email, device_name, status, issue_description, report_id
        FROM reports
        WHERE owner_name = ?;
    `;

    db.all(query, [owner_name], (err, rows) => {
        if (err) {
            console.error('Error fetching reports:', err.message);
            return res.status(500).json({ error: 'Failed to fetch reports.' });
        }

        res.json(rows);
    });
});



// Update the status of a report
app.patch('/reports/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Status is required.' });
    }

    const query = `
        UPDATE reports
        SET status = ?
        WHERE report_id = ?
    `;

    db.run(query, [status, id], function (err) {
        if (err) {
            console.error('Error updating report status:', err.message);
            return res.status(500).json({ error: 'Failed to update report status.' });
        }

        res.json({ message: 'Report status updated successfully.' });
    });
});


// Delete a report
app.delete('/reports/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM reports WHERE report_id = ?`;

    db.run(query, [id], function (err) {
        if (err) {
            console.error('Error deleting report:', err.message);
            return res.status(500).json({ error: 'Failed to delete report' });
        }

        res.json({ message: 'Report deleted successfully' });
    });
});

// Gets and displays person in charge inventory under Inventory page
app.get('/inventory', (req, res) => {
    const { person_in_charge } = req.query;
    if (!person_in_charge) {
        return res.status(400).json({ error: 'Person in charge is required.' });
    }

    const query = `
        SELECT device_id, device_name, image_path, description, available
        FROM lab_devices
        WHERE person_in_charge = ?
    `;

    db.all(query, [person_in_charge], (err, rows) => {
        if (err) {
            console.error('Error fetching inventory:', err.message);
            return res.status(500).json({ error: 'Failed to fetch inventory.' });
        }
        res.json(rows);
    });
});

// Delete device from lab_devices by device_id
app.delete('/inventory/:device_id', (req, res) => {
    const { device_id } = req.params;

    if (!device_id) {
        return res.status(400).json({ error: 'Device ID is required.' });
    }

    const query = `DELETE FROM lab_devices WHERE device_id = ?`;

    db.run(query, [device_id], function (err) {
        if (err) {
            console.error('Error deleting device:', err.message);
            return res.status(500).json({ error: 'Failed to delete device.' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Device not found.' });
        }

        res.json({ message: 'Device deleted successfully.' });
    });
});


app.get('/inventory/details', async (req, res) => {
    const { device_id } = req.query;
    if (!device_id) {
        return res.status(400).json({ error: 'Device ID is required.' });
    }
    const query = `SELECT * FROM lab_devices WHERE device_id = ?`;
    db.get(query, [device_id], (err, row) => {
        if (err) {
            console.error('Error fetching device data:', err.message);
            return res.status(500).json({ error: 'Failed to fetch device data.' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Device not found.' });
        }
        res.json(row);
    });
});
app.put("/inventory/:device_id", (req, res) => {
    const { device_id } = req.params;
    const {
        campus,
        department,
        building,
        room_number,
        person_in_charge,
        device_name,
        description,
        application,
        manual_link,
        category,
        model,
        brand,
        keywords,
        available,
        image_path,
        owner_id,
    } = req.body;
    const query = `
        UPDATE lab_devices
        SET campus = ?, department = ?, building = ?, room_number = ?, person_in_charge = ?,
            device_name = ?, description = ?, application = ?, manual_link = ?, category = ?,
            model = ?, brand = ?, keywords = ?, available = ?, image_path = ?, owner_id = ?
        WHERE device_id = ?
    `;
    db.run(
        query,
        [
            campus,
            department,
            building,
            room_number,
            person_in_charge,
            device_name,
            description,
            application,
            manual_link,
            category,
            model,
            brand,
            keywords,
            available,
            image_path,
            owner_id,
            device_id,
        ],
        function (err) {
            if (err) {
                console.error("Error updating device:", err.message);
                res.status(500).json({ error: "Failed to update device." });
            } else {
                res.json({ message: "Device updated successfully!" });
            }
        }
    );
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Generate a random 6-digit OTP
function generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
}

// Endpoint to send OTP
app.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    // Check if the email exists in the database
    const checkEmailQuery = `SELECT * FROM users WHERE user_email = ?`;
    db.get(checkEmailQuery, [email], (err, user) => {
        if (err) {
            console.error('Error checking email:', err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (!user) {
            // If email is not found in the database, return an error
            res.status(404).json({ error: 'Email not found' });
            return;
        }

        // Generate OTP if email exists
        const otp = generateOTP();
        const createdAt = new Date().toISOString();
        const insertOTPQuery = `INSERT INTO verification_code (email, code, created_at) VALUES (?, ?, ?)`;

        db.run(insertOTPQuery, [email, otp, createdAt], (err) => {
            if (err) {
                console.error('Error storing OTP:', err.message);
                res.status(500).json({ error: 'Failed to generate OTP' });
            } else {
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Your OTP Code',
                    text: `Your OTP code is: ${otp}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px; margin: 0 auto; background-color: #f9f9f9;">
                            <div style="text-align: center; margin-bottom: 20px;">
                                <img src="cid:websiteLogo" alt="Website Logo" style="width: 150px; height: auto; display: inline-block;"/>
                            </div>
                            <h2 style="color: #4CAF50; text-align: center; margin-top: 0;">Your OTP Code</h2>
                            <p style="font-size: 16px; text-align: center;">
                                Please use the following OTP code to complete your verification:
                            </p>
                            <p style="font-size: 24px; font-weight: bold; text-align: center; color: #333; margin: 10px 0;">
                                ${otp}
                            </p>
                            <p style="font-size: 14px; text-align: center; color: #666;">
                                This code is valid for 10 minutes. If you didn’t request this code, please ignore this email.
                            </p>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                            <p style="font-size: 14px; text-align: center; color: #999;">
                                Thank you for using <strong>BOOK'EM</strong>! If you have any questions, feel free to contact us.
                            </p>
                        </div>
                    `,
                    replyTo: process.env.EMAIL_USER,
                    attachments: [
                        {
                            filename: 'logo.png',
                            path: 'static/logo/bookem-high-resolution-logo-transparent.png',
                            cid: 'websiteLogo'
                        }
                    ]
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error.message);
                        res.status(500).json({ error: 'Failed to send OTP' });
                    } else {
                        console.log(`OTP sent to ${email}: ${otp}`);
                        res.json({ message: 'OTP sent to your email' });
                    }
                });
            }
        });
    });
});

// Endpoint to verify OTP
app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    const verifyOTPQuery = `
        SELECT * FROM verification_code
        WHERE email = ? AND code = ? AND created_at >= datetime('now', '-10 minutes')
    `;

    db.get(verifyOTPQuery, [email, otp], (err, row) => {
        if (err) {
            console.error('Error verifying OTP:', err.message);
            res.status(500).json({ error: 'Failed to verify OTP' });
        } else if (row) {
            console.log(`OTP verified for ${email}`);
            res.json({ message: 'OTP verified successfully' });

            const deleteOTPQuery = `DELETE FROM verification_code WHERE email = ?`;
            db.run(deleteOTPQuery, [email], (err) => {
                if (err) {
                    console.error('Error deleting OTP:', err.message);
                } else {
                    console.log(`OTP for ${email} deleted from database after verification`);
                }
            });
        } else {
            res.status(400).json({ error: 'Invalid OTP or OTP expired' });
        }
    });
});
// app.get('/test-email', (req, res) => {
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: '********@yahoo.com',
//         subject: 'Test Email',
//         text: 'This is a test email.'
//     };
    
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.error('Error sending test email:', error);
//             return res.status(500).json({ error: 'Failed to send test email' });
//         }
//         console.log('Test email sent: ' + info.response);
//         res.json({ message: 'Test email sent successfully!' });
//     });
// });

// Endpoint to add a new lab device
app.post('/add-device', (req, res) => {
    const {
        campus, department, building, room_number, person_in_charge,
        device_name, description, application, manual_link,
        category, model, brand, keywords, available, image_path,owner_id
    } = req.body;

    const query = `INSERT INTO lab_devices (
    campus, department, building, room_number, person_in_charge, device_name, 
    description, application, manual_link, category, model, brand, keywords, available, image_path, owner_id)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    db.run(query, [
        campus, department, building, room_number, person_in_charge, device_name, description, application,
        manual_link, category, model, brand, keywords, available, image_path,owner_id
    ], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: "Failed to add the lab device." });
        } else {
            res.status(200).json({ message: "Lab device was added successfully!", id: this.lastID })
        }
    });
});

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "static/equipment_photos")); // Save in static folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension); // Custom filename
    },
});

const upload = multer({ storage });

// File upload endpoint
app.post("/upload", upload.single("image"), (req, res) => {
    // Check if the file was uploaded
    const { device_id } = req.body;

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }

    // Extract the file path
    const filePath = `/${req.file.filename}`;
    const newFilePath = req.file.filename;
    // Check for an existing image for the device
    const query = `SELECT image_path FROM lab_devices WHERE device_id = ?`;
    db.get(query, [device_id], (err, row) => {
        if (err) {
            console.error("Error fetching device image:", err.message);
            return res.status(500).json({ error: "Failed to fetch device image." });
        }
        if (row && row.image_path) {
            // Construct the full path to the old image
            const oldImagePath = path.join(__dirname, "static/equipment_photos", row.image_path);
            console.log("Attempting to delete old image:", oldImagePath);

            // Check if the file exists before attempting to delete it
            fs.access(oldImagePath, fs.constants.F_OK, (accessErr) => {
                if (accessErr) {
                    console.warn(`Old image not found: ${oldImagePath}`);
                } else {
                    fs.unlink(oldImagePath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error("Error deleting old image:", unlinkErr.message);
                        } else {
                            console.log("Old image deleted successfully:", oldImagePath);
                        }
                    });
                }
            });
        } else {
            console.warn("No existing image path found for this device.");
        }
        // Update the database with the new image path
        const updateQuery = `UPDATE lab_devices SET image_path = ? WHERE device_id = ?`;
        db.run(updateQuery, [newFilePath, device_id], (updateErr) => {
            if (updateErr) {
                console.error("Error updating image path:", updateErr.message);
                return res.status(500).json({ error: "Failed to update image path." });
            }
            console.log("Image path updated successfully in the database.");
            res.status(200).json({
                message: "Image uploaded and path updated successfully.",
                path: newFilePath,
            });
        });
    });
});

// Endpoint to add a new user in signup page
app.post('/add-user', (req, res) => {
    const { name, email, campus_id, school_id, role_id } = req.body;

    if (!name || !email || !campus_id || !school_id || role_id === undefined) {
        return res.status(400).json({ error: 'Name, email, campus ID, school ID, and role ID are required' });
    }

    // Check for duplicate user_name or user_email
    const checkDuplicateQuery = `SELECT * FROM users WHERE user_name = ? OR user_email = ?`;
    db.get(checkDuplicateQuery, [name, email], (err, row) => {
        if (err) {
            console.error('Error checking for duplicates:', err.message);
            return res.status(500).json({ error: 'Failed to check for duplicate user' });
        }

        if (row) {
            return res.status(400).json({ error: 'User with this name or email already exists' });
        }

        // Insert the new user if no duplicates found
        const insertQuery = `INSERT INTO users (user_name, user_email, campus_id, school_id, role_id) VALUES (?, ?, ?, ?, ?)`;
        db.run(insertQuery, [name, email, campus_id, school_id, role_id], function (err) {
            if (err) {
                console.error('Error adding user to database:', err.message);
                return res.status(500).json({ error: 'Failed to add user' });
            }

            // Retrieve the newly created user's full data
            const getUserQuery = `SELECT * FROM users WHERE user_id = ?`;
            db.get(getUserQuery, [this.lastID], (err, newUser) => {
                if (err) {
                    console.error('Error retrieving new user:', err.message);
                    return res.status(500).json({ error: 'Failed to retrieve new user' });
                }
                // Return the new user's full data
                res.json({
                    message: 'User added successfully',
                    user: newUser,
                });
            });
        });
    });
});

// updates database when user updates their profile information
app.put('/user', (req, res) => {
    const { user_email, user_name, phone_number } = req.body;

    if (!user_email || !user_name || !phone_number) {
        return res.status(400).json({ error: 'Email, name, and phone number are required.' });
    }

    const query = `
        UPDATE users 
        SET user_name = ?, phone_number = ? 
        WHERE user_email = ?
    `;

    db.run(query, [user_name, phone_number, user_email], function (err) {
        if (err) {
            console.error('Error updating user:', err.message);
            res.status(500).json({ error: 'Failed to update user.' });
        } else {
            res.json({ message: 'User updated successfully.' });
        }
    });
});

// fetches a user's data after logging in and saves it to UserContext
app.post('/user', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
    }

    const query = `SELECT * FROM users WHERE user_email = ?`;

    db.get(query, [email], (err, row) => {
        if (err) {
            console.error('Error fetching user by email:', err.message);
            res.status(500).json({ error: 'Failed to fetch user.' });
        } else if (!row) {
            res.status(404).json({ error: 'No user found with the provided email.' });
        } else {
            res.json({ message: 'User fetched successfully.', user: row });
        }
    });
});


// Fetch user data by user_name for person in charge
app.post('/user-by-name', (req, res) => {
    const { name } = req.body;

    console.log("Received Payload:", req.body);

    if (!name) {
        console.warn("Name not provided");
        return res.status(400).json({ error: 'Name is required.' });
    }

    const query = `SELECT * FROM users WHERE user_name = ?`;

    db.get(query, [name], (err, row) => {
        if (err) {
            console.error('Database error:', err.message);
            res.status(500).json({ error: 'Failed to fetch user by name.' });
        } else if (!row) {
            console.warn("No user found for name:", name);
            res.status(404).json({ error: 'No user found with the provided name.' });
        } else {
            console.log("User found:", row);
            res.json({ message: 'User fetched successfully by name.', user: row });
        }
    });
});

// sends message to recipient about equipment inquiry
app.post('/save-and-send-message', (req, res) => {
    const { sender_email, recipient_email, message_content, equipment_name } = req.body;

    if (!sender_email || !recipient_email || !message_content || !equipment_name) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    console.log('Received Payload:', req.body); // Debugging log


    // Save the message in the database
    const query = `
        INSERT INTO messages (sender_email, recipient_email, message_content, equipment_name)
        VALUES (?, ?, ?, ?)
    `;

    db.run(query, [sender_email, recipient_email, message_content, equipment_name], function (err) {
        if (err) {
            console.error('Error saving message:', err.message);
            return res.status(500).json({ error: 'Failed to save message' });
        }

        // Construct the email content
        const fullMessageContentText = `Inquiry for ${equipment_name}:\n${message_content}\n\n---\nReplying to this email will automatically send to the sender's email (${sender_email}).`;

        const fullMessage_Html = `
            <p><strong>Inquiry for ${equipment_name}:</strong></p>
            <p>${message_content}</p>
            <hr />
            <p style="font-style: italic; color: gray;">
              Replying to this email will automatically send to the sender's email (<strong>${sender_email}</strong>).
            </p>
        `;

        const mailOptions = {
            from: sender_email,
            to: recipient_email,
            subject: `Equipment Inquiry`,
            text: fullMessageContentText,
            html: fullMessage_Html,
            replyTo: sender_email, 
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error.message);
                return res.status(500).json({ error: 'Message saved but failed to send email' });
            }

            console.log('Email sent:', info.response);
            res.json({ message: 'Message saved and email sent successfully', messageId: this.lastID });
        });
    });
});



// Function to get all lab devices
function getAllLabDevices() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM lab_devices', [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

function getAllBookmarks(id){
    return new Promise ((resolve, reject) => {
        const query = 'SELECT device_id FROM bookmarks WHERE toggle = 1 AND user_id = ?';
        db.all(query,[id], [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        })
    });
}

// Endpoint to fetch all lab devices
app.get('/all', async (req, res) => {
    try {
        const rows = await getAllLabDevices();
        res.json(rows);
    } catch (error) {
        console.error('Error fetching lab devices:', error.message);
        res.status(500).send("Error fetching data");
    }
});

// bookmarked
app.post('/bookmarked', (req, res) => {
    const { newid, userid } = req.body;

    if (!newid || !userid) {
        return res.status(400).json({ error: 'Device ID or User ID is missing.' });
    }

    console.log("Bookmark request received for Device ID:", newid, "and User ID:", userid);
    try{
         // Step 1: Verify if the user exists in the `users` table
        const checkQuery = `SELECT * FROM bookmarks WHERE device_id = ? AND user_id = ?`;
        db.get(checkQuery, [newid, userid], (err, bookmark) => {
            if (err) {
                console.error('Error checking bookmark:', err.message);
                return res.status(500).json({ error: 'Failed to check bookmark.' });
            }
              // If the bookmark exists, toggle the `toggle` column value
            if (bookmark) {
                // Switch between 0 and 1
                const newToggleValue = bookmark.toggle === 1 ? 0 : 1; 
                const updateQuery = `UPDATE bookmarks SET toggle = ? WHERE device_id = ? AND user_id = ?`;
                db.run(updateQuery, [newToggleValue, newid, userid], function (err) {
                    if (err) {
                        console.error('Error updating toggle value:', err.message);
                        return res.status(500).json({ error: 'Failed to update toggle value.' });
                    }

                    res.status(200).json({
                        success: true,
                        message: 'Bookmark toggle updated successfully.',
                        newToggle: newToggleValue,
                    });
                });
            } 


            
            else {
                // If the bookmark doesn't exist, return a message (or optionally create one)
                // Insert the bookmark into the `bookmarks` table
                const toggle = 1;
                console.log("bookmark not found, inserting bookmark")
                const insertBookmarkQuery = `INSERT INTO bookmarks (device_id, user_id, toggle) VALUES (?, ?, ?)`;
                db.run(insertBookmarkQuery, [newid, userid, toggle], function (err) {
                    if (err) {
                        console.error('Error inserting bookmark:', err.message);
                        return res.status(500).json({ error: 'Failed to save bookmark.' });
                    }

                console.log(`Bookmark saved for Device ID: ${newid} by User ID: ${userid}`);
                res.status(200).json({ success: true, message: 'Bookmark saved successfully.', bookmarkId: this.lastID, newToggle: 1 });
                });
            }
        });
    }
    catch (error) {
         console.error("Error bookmarking:", error);
         console.log("Failed to bookmark. Please try again.");
    } 
        
});

// fetches a user's bookmarks
app.get('/toggled', async (req, res) => {
    const userid = req.query.userid; // Use query parameters for GET request
    if (!userid) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const rows = await getAllBookmarks(userid);
        const deviceIds = rows.map(row => row.device_id); // Extract device IDs
        res.json({ bookmarks: deviceIds });
    } catch (error) {
        console.error('Error fetching bookmarked devices:', error.message);
        res.status(500).send("Error fetching data");
    }
});

// Booking request submitted (WIP)
app.post('/submitRequest', (req, res) => {
    try{
        // Step 1: Verify if the user exists in the `users` table
       const checkQuery = `SELECT * FROM unavailable WHERE device_id = ? AND user_id = ?`;
       db.get(checkQuery, [newid, userid], (err, schedule) => {
           if (err) {
               console.error('Error checking schedule:', err.message);
               return res.status(500).json({ error: 'Failed to check schedule.' });
           }
             // If the schedule exists then save the information from the user's request and store it until 
             // they hit confirm booking request
           if (schedule) {
               // Submit 
               const newToggleValue = bookmark.toggle === 1 ? 0 : 1; 
               const updateQuery = `UPDATE bookmarks SET toggle = ? WHERE device_id = ? AND user_id = ?`;
               db.run(updateQuery, [newToggleValue, newid, userid], function (err) {
                   if (err) {
                       console.error('Error updating toggle value:', err.message);
                       return res.status(500).json({ error: 'Failed to update toggle value.' });
                   }

                   res.status(200).json({
                       success: true,
                       message: 'Bookmark toggle updated successfully.',
                       newToggle: newToggleValue,
                   });
               });
           } 
           else {
               // If the bookmark doesn't exist, return a message (or optionally create one)
               // Insert the bookmark into the `bookmarks` table
               const toggle = 1;
               console.log("bookmark not found, inserting bookmark")
               const insertBookmarkQuery = `INSERT INTO bookmarks (device_id, user_id, toggle) VALUES (?, ?, ?)`;
               db.run(insertBookmarkQuery, [newid, userid, toggle], function (err) {
                   if (err) {
                       console.error('Error inserting bookmark:', err.message);
                       return res.status(500).json({ error: 'Failed to save bookmark.' });
                   }

               console.log(`Bookmark saved for Device ID: ${newid} by User ID: ${userid}`);
               res.status(200).json({ success: true, message: 'Bookmark saved successfully.', bookmarkId: this.lastID });
               });
           }
       });
   }
   catch (error) {
        console.error("Error bookmarking:", error);
        console.log("Failed to bookmark. Please try again.");
   } 
});

function getAllHistory(id){
    return new Promise((resolve, reject)  => {
        const query = `
            SELECT 
                h.history_id, 
                h.schedule_id, 
                h.booking_date, 
                h.booking_time, 
                h.reason, 
                h.device_id,  -- Ensure this column is selected from the history table
                ld.device_id AS lab_device_id, -- Include device_id explicitly from lab_devices
                ld.device_name, 
                ld.description, 
                ld.person_in_charge, 
                ld.building, 
                ld.image_path 
            FROM history h
            JOIN lab_devices ld ON h.device_id = ld.device_id
            WHERE h.student_id = ?
        `;
        db.all(query,[id], [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// getting the history
app.get('/myhistory', async(req, res) =>  {
    const userId = req.query.userId; // Use query parameters for GET request
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    try {
        const rows = await getAllHistory(userId);
        if (rows.length === 0) {
            return res.json({ message: 'No history found' });
        }
        res.json(rows);
    } catch (error) {
        console.error('Error fetching history:', error.message);
        res.status(500).send("Error fetching data");
    }
});

// Close database connection on server close
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing the database:', err.message);
        } else {
            console.log('Closed the database connection.');
        }
        process.exit(0);
    });
});


