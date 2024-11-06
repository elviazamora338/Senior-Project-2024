const express = require('express');
const sqlite3 = require('sqlite3').verbose(); 
const cors = require('cors'); 
const path = require('path'); 

const app = express(); 
const PORT = process.env.PORT || 5001; 
app.use(cors()); 
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'static'))); 

// Function to connect to the database
function dbconnection() {
    const db = new sqlite3.Database('SchedulerDB.db', (err) => {
        if (err) {
            console.error('Error connecting to the database', err.message);
        } else {
            console.log('Connected to the SQLite database.');
        }
    }); 
    return db; 
}

// Function to get all lab devices
function getAllLabDevices() {
    return new Promise((resolve, reject) => {
        const db = dbconnection();
        db.all('SELECT * FROM lab_devices', [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
            db.close();
        });
    });
}

app.get('/all', async (req, res) => {
    try {
        const rows = await getAllLabDevices();
        res.json(rows);
    } catch (error) {
        console.error('Error executing query:', error.message);
        res.status(500).send("Error fetching data");
    }
}); 

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}); 
