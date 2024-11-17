// Import React and necessary hooks
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import './View_Equipment.css'
// import cal_button from '../../static/buttons/utrgv_banner.jpg''
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

const ViewPage = () => {
    return (
        <>
        <div className="container">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="row">

                                <div className="container-fluid uploadImage">
                                    <i className="bi bi-cloud-arrow-up"></i>
                                </div>

                                <div className="col-md-6">
                                    <h4>Campus</h4>
                                    <select id="campusSelect" className="form-select form-select-sm">
                                        <optgroup label="Campus">
                                            <option value="" disabled selected>Select Campus</option>
                                            <option value="Edinburg">Edinburg</option>
                                            <option value="Brownsville">Brownsville</option>
                                        </optgroup>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <h4>Department</h4>
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
                                    <h4>Building</h4>
                                    <select id="buildingSelect" className="form-select form-select-sm">
                                        <optgroup label="Building">
                                            <option value="" disabled selected>Select Building</option>
                                            <option value="EPOB4">EPOB4 - Engineering Portable</option>
                                            <option value="EENGR">EENGR - Engineering</option>
                                            <option value="EACSB">EACSB- Academic Services</option>
                                            <option value="ESCNE">ESCNE - Science</option>
                                        </optgroup>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <h4>Room #</h4>
                                    <input type="number" id="room_number" name="room_number"
                                        className="form-control form-control-sm" step="any" />
                                </div>
                            </div>

                            <h4>Person in Charge</h4>
                            <input type="text" id="person_in_charge" name="person_in_charge" className="form-control" />

                            <h4>Link to Manual</h4>
                            <input type="text" id="manual_link" name="manual_link" className="form-control" />
                        </div>

                        <div className="col right-col">
                            <div className="title">
                                <h1 className="fw-bold">Equipment Name</h1>
                                <h6 className="text-success">Available: 2</h6>
                            </div>

                            <h4>Description</h4>
                            <textarea id="description" name="description" className="form-control" rows="3"></textarea>

                            <h4>Application</h4>
                            <textarea id="application" name="application" className="form-control" rows="2"></textarea>
                        
                            <div class="row">
                                <div class="col-md-4">
                                    <h4>Category</h4>
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
                                </div>

                                <div className="col-md-4">
                                    <h4>Model</h4>
                                    <input type="text" id="model" name="model" className="form-control" />
                                </div>
                            
                                <div className="col-md-4">
                                    <h4>Brand</h4>
                                    <select id="brand_select" class="form-select">
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
                                </div>
                            </div>

                            <div className="scheduleContainer">
                                <h5 className="schedule-text fw-bold">Schedule Equipment:</h5>
                                <div className="row">

                                    <div className="container-fluid uploadCalendar">
                                    </div>

        
                                    <div className="message-row">
                                        <div className="col-8">
                                            <h6>Reason for booking</h6>
                                            <textarea type="message" name="message" className="form-control" rows="3" ></textarea>
                                        </div>

                                        <div className="time-row">
                                            <div className="time-col">
                                                <div>
                                                    <input type="checkbox" id="time1" name="time1" value="time1"></input>
                                                    <label for="time1">8 AM - 10 AM</label><br></br>
                                        
                                                    <input type="checkbox" id="time2" name="time2" value="time2"></input>
                                                    <label for="time2">10 AM - 12 PM</label><br></br>
                                        
                                                    <input type="checkbox" id="time3" name="time3" value="time3"></input>
                                                    <label for="time3">12 PM - 2 PM</label><br></br>
                                                </div>
                                            </div>
                                        
                                            <div class="time-col">
                                                <div>
                                                    <input type="checkbox" id="time4" name="time4" value="time4"></input>
                                                    <label for="time4">2 PM - 4 PM</label><br></br>
                                        
                                                    <input type="checkbox" id="time5" name="time5" value="time5"></input>
                                                    <label for="time5">4 PM - 6 PM</label><br></br>
                                        
                                                    <input type="checkbox" id="time6" name="time6" value="time6"></input>
                                                    <label for="time6">6 PM - 8 PM</label><br></br>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
        
                                    <div className="text-center mt-3">
                                        <button type="button" class="btn schedule-button">Schedule</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
        </>
    );
};

export default ViewPage;