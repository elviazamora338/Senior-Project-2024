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

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
