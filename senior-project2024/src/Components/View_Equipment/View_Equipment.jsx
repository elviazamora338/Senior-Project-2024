// Import React and necessary hooks
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './View_Equipment.css'
// import cal_button from '../../static/buttons/utrgv_banner.jpg''
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

const ViewPage = ({ device }) => {
    console.log("Device in ViewPage:", device);  // Log device prop to check if it's passed correctly
    if (!device) return <p>No device data available</p>;
    
    return (
        <>
        <div className="container">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="row">

                                <div className="container-fluid">
                                <img
                                    src={`http://localhost:5001/static/equipment_photos/${device.image_path}`}
                                    alt={device.device_name}
                                    className="item-image me-2"
                                />
                                </div>

                                <div className="col-md-6">
                                    <h4>Campus</h4>
                                    <input
                                        type="text"
                                        id="campus"
                                        name="campus"
                                        className="form-control"
                                        value={device.campus || ''}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <h4>Department</h4>
                                    <input
                                        type="text"
                                        id="department"
                                        name="department"
                                        className="form-control"
                                        value={device.department || ''}

                                    />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <h4>Building</h4>
                                    <input
                                        type="text"
                                        id="building"
                                        name="building"
                                        className="form-control"
                                        value={device.building || ''}
                                    />
                                </div>
                                <div class="col-md-6">
                                    <h4>Room #</h4>
                                    <input
                                        type="number"
                                        id="room_number"
                                        name="room_number"
                                        className="form-control"
                                        value={device.room_number || ''}
                                    />
                                </div>
                            </div>

                            <h4>Person in Charge</h4>
                            <input
                                type="text"
                                id="person_in_charge"
                                name="person_in_charge"
                                className="form-control"
                                value={device.person_in_charge || ''}
                            />

                            <h4>Link to Manual</h4>
                            <input
                                type="text"
                                id="manual_link"
                                name="manual_link"
                                className="form-control"
                                value={device.manual_link || ''}
                            />
                        </div>

                        <div className="col right-col">
                            <div className="title">
                                <h1 className="fw-bold">{device.device_name}</h1>
                                <h6 className="text-success">Available: {device.available || 'N/A'}</h6>
                            </div>

                            <h4>Description</h4>
                            <textarea
                                id="description"
                                name="description"
                                className="form-control"
                                rows="3"
                                value={device.description || ''}
                            ></textarea>

                            <h4>Application</h4>
                            <textarea
                                id="application"
                                name="application"
                                className="form-control"
                                rows="3"
                                value={device.application || ''}
                            ></textarea>
                            <div className="row">
                                <div className="col-md-4">
                                    <h4>Category</h4>
                                    <input
                                        type="text"
                                        id="category"
                                        name="category"
                                        className="form-control"
                                        value={device.category || ''}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <h4>Model</h4>
                                    <input
                                        type="text"
                                        id="model"
                                        name="model"
                                        className="form-control"
                                        value={device.model || ''}
                                    />
                                </div>
                            
                                <div className="col-md-4">
                                    <h4>Brand</h4>
                                    <input
                                        type="text"
                                        id="brand"
                                        name="brand"
                                        className="form-control"
                                        value={device.brand || ''}
                                    />
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
                                        <button type="button" className="btn schedule-button">Schedule</button>
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