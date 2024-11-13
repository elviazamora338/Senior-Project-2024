// Import React and necessary hooks
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import './Add_Screen.css'
import banner from '../../static/uni_banner/utrgv_banner.jpg'; // Import image from source
// import cal_button from '../../static/buttons/utrgv_banner.jpg''
import Calendar from '../Calendar_Page/Calendar_Screen.jsx'; // Import the Calendar component
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

const AddPage = () => {
    const [showCalendar, setShowCalendar] = useState(false);
    // Calendar Modal toggle handlers
    const handleCalendarClose = () => setShowCalendar(false);
    const handleCalendarShow = () => setShowCalendar(true);

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div className="sidebar flex-shrink-0 p-3">
                <ul className="nav">
                    <br />
                    <li className="nav-item nav-icon">
                        <Link to="/home" className="nav-link text-white">
                            <div className="nav-icon">
                                <i className="bi bi-house-door"></i>
                            </div>
                            <span>Home</span>
                        </Link>
                    </li>
                    <li className="nav-item nav-icon">
                        <Link to="/all" className="nav-link text-white">
                            <div className="nav-icon">
                                <i className="bi bi-grid"></i>
                            </div>
                            <span>All</span>
                        </Link>
                    </li>
                    <li className="nav-item nav-icon">
                        <Link to="/add" className="nav-link text-white">
                            <div className="nav-icon">
                                <i className="bi bi-plus-circle"></i>
                            </div>
                            <span>Add</span>
                        </Link>
                    </li>
                    <li className="nav-item nav-icon">
                        <Link to="/requests" className="nav-link text-white">
                            <div className="nav-icon">
                                <i className="bi bi-box"></i>
                            </div>
                            <span>My Equipment</span>
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="container-fluid p-0 table-content">
                {/* Header */}
                <div className="card card-custom mb-0">
                    <div className="card-body table-header">
                        <div className="row">
                            <div className="col-sm-8"></div>
                            <div className="col-sm-4">
                                <div className="d-flex justify-content-end text-over text-white">
                                    <i classname>Change University</i>
                                    <i className="text-black bi bi-paperclip mx-2"></i>
                                    <i className="text-black bi bi-calendar4-event mx-2"></i>
                                    <i className="text-black bi-three-dots-vertical mx-2"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* University Banner */}
                <div className="container container-banner mt-3">
                    <div className="img-container">
                        <img src={banner} alt="UTRGV logo banner" />
                        <div className="text-overlay">
                            <h1>Equipment Scheduler</h1>
                            <br></br>
                        </div>
                        <div className="button-container">
                            <button className="btn btn-light btn-custom">
                                <i className="bi bi-calendar4-event"></i> Add to my itinerary
                            </button>
                            <button className="btn btn-light btn-custom">
                                <i className="bi bi-person-walking"></i> 12 min from current location
                            </button>
                        </div>
                    </div>
                </div>

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
                                    <select id="campusSelect" className="form-select form-select-sm">
                                        <optgroup label="Campus">
                                            <option value="" disabled selected>Select Campus</option>
                                            <option value="Edinburg">Edinburg</option>
                                            <option value="Brownsville">Brownsville</option>
                                        </optgroup>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <h5>Department</h5>
                                    <select id="departmentSelect" class="form-select form-select-sm">
                                        <optgroup label="Department">
                                            <option value="" disabled selected>Select Department</option>
                                            <option value="Biology">Biology</option>
                                            <option value="Physics">Physics</option>
                                            <option value="School of Medicine">School of Medicine</option>
                                        </optgroup>
                                    </select>
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <h5>Building</h5>
                                    <select id="buildingSelect" class="form-select form-select-sm">
                                        <optgroup label="Building">
                                            <option value="" disabled selected>Select Building</option>
                                            <option value="EPOB4">EPOB4 - Engineering Portable</option>
                                            <option value="EENGR">EENGR - Engineering</option>
                                            <option value="EACSB">EACSB- Academic Services</option>
                                            <option value="ESCNE">ESCNE - Science</option>
                                        </optgroup>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <h5>Room #</h5>
                                    <input type="number" id="room_number" name="room_number"
                                        className="form-control form-control-sm" step="any" />
                                </div>
                            </div>

                            <h5>Person in Charge</h5>
                            <input type="text" id="person_in_charge" name="person_in_charge" className="form-control" />
                            <br></br>
                        </div>

                        <div class="col-md-4">
                            <h5>Equipment Name</h5>
                            <input type="text" id="equipment_name" name="equipment_name" className="form-control" />

                            <h5>Description</h5>
                            <textarea id="description" name="description" className="form-control resize-text" rows="4"></textarea>

                            <h5>Application</h5>
                            <textarea id="application" name="application" className="form-control resize-text" rows="4"></textarea>

                            <h5>Link to Manual</h5>
                            <input type="text" id="manual_link" name="manual_link" className="form-control" />
                        </div>

                        <div className="col-md-4">
                            <h5>Category</h5>
                            <select id="category_select" className="form-select">
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
                            <input type="text" id="model" name="model" className="form-control" />

                            <h5>Brand</h5>
                            <select id="brand_select" className="form-select">
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
                            <input type="text" id="keywords" name="keywords" className="form-control"></input>

                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <h5>Number Available</h5>
                                    <input type="number" id="available" name="available" className="form-control"></input>
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
                                <button type="button" className="btn btn-secondary save-button">Save</button>
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
            </div>
        </div>
    );
};

export default AddPage;

