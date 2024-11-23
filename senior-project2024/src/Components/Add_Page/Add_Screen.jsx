// Import React and necessary hooks
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import './Add_Screen.css'
// import cal_button from '../../static/buttons/utrgv_banner.jpg''
import Calendar from '../Calendar_Page/Calendar_Screen.jsx'; // Import the Calendar component
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from 'axios';
const AddPage = () => {
    const [showCalendar, setShowCalendar] = useState(false);
    // Calendar Modal toggle handlers
    const handleCalendarClose = () => setShowCalendar(false);
    const handleCalendarShow = () => setShowCalendar(true);
    const [formData, setFormData] = useState({
        campus: "",
        department: "",
        building: "",
        room_number: "",
        person_in_charge: "",
        device_name: "",
        description: "",
        application: "",
        manual_link: "",
        category: "",
        model: "",
        brand: "",
        keywords: "",
        available: 0

    }); 
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target; 
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        })); 
    }

    const handleSave = async () => {

        const missingFields = []; 
        if (!formData.campus) missingFields.push("Campus"); 
        if (!formData.department) missingFields.push("Department"); 
        if (!formData.device_name) missingFields.push("Device Name"); 
        if (!formData.person_in_charge) missingFields.push("Person in Charge");
        if (!formData.category) missingFields.push("Category")
        if (!formData.building) missingFields.push("Building"); 

        // show alert if there are missing fields
        if (missingFields.length > 0) {
            alert(`Please fill out the following required fields: ${missingFields.join(", ")}`); 
            return; //stop execution if validation fails
        }

        try {
            const response = await axios.post('http://localhost:5001/add-device', formData); 
            alert(response.data.message); 
        } catch (error) {
            console.error("Error saving lab device:", error); 
            alert("Failed to save the lab device."); 
        }
    }
    return (
        <>
                {/* Adding Equipment */}
                <div className="container-fluid">
                    <h1 className="page-header">New Equipment</h1>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="row">

                                <div className="container-fluid uploadImage">
                                    <i className="bi bi-cloud-arrow-up"></i>
                                    <a className="link text-primary ">Upload Image</a>
                                </div>

                                <div className="col-md-6">
                                    <h5>Campus</h5>
                                    <select id="campusSelect" className={`form-select form-select-sm ${!formData.campus ? "is-invalid" : ""}`} value={formData.campus} onChange={(e) => setFormData({...formData, campus: e.target.value})}>
                                        <optgroup label="Campus">
                                            <option value="" disabled selected>Select Campus</option>
                                            <option value="Edinburg">Edinburg</option>
                                            <option value="Brownsville">Brownsville</option>
                                        </optgroup>
                                </select>
                                {!formData.campus && <div className='invalid-feedback'>Campus is required.</div>}
                                </div>
                                <div className="col-md-6">
                                    <h5>Department</h5>
                                    <select id="departmentSelect" class={`form-select form-select-sm ${!formData.department && 'is-invalid'}`} value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})}>
                                        <optgroup label="Department">
                                            <option value="" disabled selected>Select Department</option>
                                            <option value="Biology">Biology</option>
                                            <option value="Physics">Physics</option>
                                            <option value="School of Medicine">School of Medicine</option>
                                        </optgroup>
                                </select>
                                {!formData.department && <div className='invalid-feedback'>Department is required.</div>}
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <h5>Building</h5>
                                    <select id="buildingSelect" class={`form-select form-select-sm ${!formData.building && 'is-invalid'}`} value={formData.building} onChange={((e) => setFormData({...formData, building: e.target.value}))}>
                                        <optgroup label="Building">
                                            <option value="" disabled selected>Select Building</option>
                                            <option value="EPOB4">EPOB4 - Engineering Portable</option>
                                            <option value="EENGR">EENGR - Engineering</option>
                                            <option value="EACSB">EACSB- Academic Services</option>
                                            <option value="ESCNE">ESCNE - Science</option>
                                        </optgroup>
                                </select>
                                {!formData.building && <div className='invalid-feedback'>Building is required.</div>}
                                </div>
                                <div className="col-md-6">
                                    <h5>Room #</h5>
                                    <input type="number" id="room_number" name="room_number"
                                        className={`form-select form-select-sm ${!formData.room_number && 'is-invalid'}`} step="any" value={formData.room_number} onChange={handleChange}/>
                                </div>
                            </div>

                            <h5>Person in Charge</h5>
                            <input type="text" id="person_in_charge" name="person_in_charge" className="form-control" value={formData.person_in_charge} onChange={handleChange} />
                            <br></br>
                        </div>

                        <div class="col-md-4">
                            <h5>Equipment Name</h5>
                            <input type="text" id="device_name" name="device_name" className="form-control" value={formData.device_name} onChange={handleChange}/>

                            <h5>Description</h5>
                            <textarea id="description" name="description" className="form-control resize-text" rows="4" value={formData.description} onChange={handleChange}></textarea>

                            <h5>Application</h5>
                            <textarea id="application" name="application" className="form-control resize-text" rows="4" value={formData.application} onChange={handleChange}></textarea>

                            <h5>Link to Manual</h5>
                            <input type="text" id="manual_link" name="manual_link" className="form-control" value={formData.manual_link} onChange={handleChange} />
                        </div>

                        <div className="col-md-4">
                            <h5>Category</h5>
                            <select id="category_select" className="form-select" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                                <optgroup label="Category">
                                    <option value="" disabled selected>Select Category</option>
                                    <option value="FFT_Spectrum">FFT Spectrum Analyzer</option>
                                    <option value="Current_Source">Current Source</option>
                                    <option value="Function_Generator">Function Generator</option>
                                    <option value="Amplifier">Amplifier</option>
                                    <option value="Preamplifier">Preamplifier</option>
                                    <option value="Power_Supply">Power Supply</option>
                                </optgroup>
                            </select>

                            <h5>Model</h5>
                            <input type="text" id="model" name="model" className="form-control" value={formData.model} onChange={handleChange} />

                            <h5>Brand</h5>
                            <select id="brand_select" className="form-select" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})}>
                                <optgroup label="Brand">
                                    <option value="" disabled selected>Select Brand</option>
                                    <option value="Stanford_Research">Stanford Research Systems</option>
                                    <option value="VICI">VICI</option>
                                    <option value="BandK_Precision">B&K Precision</option>
                                    <option value="Global_Specialties">Global Specialties</option>
                                    <option value="BSIDE">BSIDE</option>
                                    <option value="PASCO">PASCO</option>
                                </optgroup>
                            </select>

                            <h5>Keywords</h5>
                            <input type="text" id="keywords" name="keywords" className="form-control" value={formData.keywords} onChange={handleChange}></input>

                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <h5>Number Available</h5>
                                    <input type="number" id="available" name="available" className="form-control" value={formData.available} onChange={handleChange}></input>
                                </div>
                                {/* Checkbox and label */}
                                <div className="col-md-6 align-items-center">
                                    <div className="form-check availability d-flex align-items-center me-2">
                                        <input type="checkbox" name="availability" value="availability" className="form-check-input"></input>
                                        <label for="availability" className="form-check-label ms-2">Available</label>
                                    </div>
                                    {/* Calendar Button */}
                                    <button type="button" className="bi bi-calendar4 btn-light btn-sm cal-button d-flex" onClick={handleCalendarShow}></button>
                                </div>
                            </div>

                            <div class="text-center mt-3">
                                <button type="button" className="btn btn-secondary save-button" onClick={handleSave}>Save</button>
                            </div>


                            {/* Calendar Modal */}
                            <Modal show={showCalendar} onHide={handleCalendarClose} centered dialogClassName="custom-wide-modal"  size="xl" >
                                <Modal.Header closeButton>
                                    <Modal.Title>Select Dates</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {/* Render the Calendar Component */}
                                    <Calendar />
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCalendarClose}>
                                        Close
                                    </Button>
                                    <Button variant="primary" onClick={handleCalendarClose}>
                                        Save Changes
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                            <br></br>

                        </div>
                    </div>
                </div>
        </>
    );
};

export default AddPage;