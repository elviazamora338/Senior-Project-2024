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


