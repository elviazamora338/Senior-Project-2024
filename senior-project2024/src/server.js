const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5001;
app.use(cors());
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'static')));

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

    const query = `UPDATE booking_requests SET status = ? WHERE schedule_id = ?`;

    db.run(query, [status, id], function (err) {
        if (err) {
            console.error('Error updating request status:', err.message);
            return res.status(500).json({ error: 'Failed to update request status' });
        }
        res.json({ message: 'Request status updated successfully' });
    });
});

// Insert into unavailable table in the database to update the calendar
app.post('/unavailable', async (req, res) => {
    const { time_range, student_id, device_id, owner_id, date } = req.body;

    try {
        const query = `
            INSERT INTO unavailable (time_range, student_id, device_id, owner_id, date)
            VALUES (?, ?, ?, ?, ?)
        `;
        await db.run(query, [time_range, student_id, device_id, owner_id, date]);
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
                u.owner_id,
                o.user_name AS owner_name
            FROM unavailable u
            JOIN lab_devices d ON u.device_id = d.device_id
            JOIN users o ON u.owner_id = o.user_id
            WHERE u.student_id = ?;
        `;
        
        db.all(query, [student_id], (err, rows) => {
        if (err) {
            console.error('Error fetching scheduled data:', error.message);
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




// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
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
                html: `<p>Your OTP code is: <strong>${otp}</strong></p>`, 
                replyTo: process.env.EMAIL_USER
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
//         to: 'amadozuniga3@yahoo.com',
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


