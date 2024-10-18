from flask import Flask, render_template, request
import sqlite3

app = Flask(__name__, template_folder='mockups')

# fetches all the data from the lab_devices table
def db_connection():
    # Connect to your database
    conn = sqlite3.connect('SchedulerDB.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def sign_up():
    return render_template('Sign_Up_Screen.html')

@app.route('/all')
def lab_devices():
    conn = db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM lab_devices")
    lab_devices = cursor.fetchall()
    conn.close()
    
    # pass the lab devices to the template
    return render_template('All.html', lab_devices=lab_devices)
    
@app.route('/home')
def home(): 
    conn = db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM campuses")
    campuses = cursor.fetchall()
    
    return render_template('Home.html',campuses=campuses)

@app.route('/login')
def login():
    return render_template('Login_Screen.html')

@app.route('/authentication')
def authenticate():
    return render_template('Login_Auth.html')
    
@app.route('/add')
def add():
    return render_template('Add.html')

@app.route('/inventory')
def inventory():
    return render_template('MyEquipment_Inventory.html')

@app.route('/requests')
def requests():
    return render_template('MyEquipment_Requests.html')

if __name__ == '__main__':
    app.run(debug=True, port=5001)
    
    


