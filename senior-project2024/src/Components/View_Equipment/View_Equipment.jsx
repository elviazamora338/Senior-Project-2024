// Import React and necessary hooks
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './View_Equipment.css';
import * as bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Profile_Message from "../Profile_Page/Profile_Message.jsx";

const ViewPage = ({ device }) => {
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const [personInChargeName, setPersonInChargeName] = useState('');

    // Initialize tooltips (Always execute useEffect)
    useEffect(() => {
        const tooltipTriggerList = Array.from(
            document.querySelectorAll('[data-toggle="tooltip"]')
        );
        tooltipTriggerList.forEach((tooltipTriggerEl) => {
            new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }, []);

    if (!device) {
        return <p>No device data available</p>;
    }

    // Handle "Person in Charge" click
    const handlePersonInChargeClick = () => {
        setPersonInChargeName(device.person_in_charge); // Ensure 'person_in_charge' matches your data
        setShowProfilePopup(true);
    };

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
                                        className="item-image me-2"
                                    />
                                </div>

                                <div className="col-md-6">
                                    <h5>Campus</h5>
                                    <input
                                        type="text"
                                        id="campus"
                                        name="campus"
                                        className="form-control deviceDetails"
                                        value={device.campus || ''}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <h5>Department</h5>
                                    <input
                                        type="text"
                                        id="department"
                                        name="department"
                                        className="form-control deviceDetails"
                                        value={device.department || ''}
                                    />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <h5>Building</h5>
                                    <input
                                        type="text"
                                        id="building"
                                        name="building"
                                        className="form-control deviceDetails"
                                        value={device.building || ''}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <h5>Room #</h5>
                                    <input
                                        type="text"
                                        id="room_number"
                                        name="room_number"
                                        className="form-control deviceDetails"
                                        value={device.room_number || ''}
                                    />
                                </div>
                            </div>

                            <h5>Person in Charge</h5>
                            <p>
                                <a
                                    href="#"
                                    onClick={handlePersonInChargeClick}
                                    className="link-input"
                                    >
                                    {device.person_in_charge || 'N/A'}
                                </a>
                            </p>

                            <h5>Link to Manual</h5>
                            <input
                                type="text"
                                id="manual_link"
                                name="manual_link"
                                className="form-control deviceDetails"
                                value={device.manual_link || ''}
                            />
                        </div>

                        <div className="col right-col">
                            <div>
                                <h2 className="fw-bold">{device.device_name}</h2>
                                <h6 className="text-success">Available: {device.available || 'N/A'}</h6>
                            </div>

                            <h5>Description</h5>
                            <textarea
                                id="description"
                                name="description"
                                className="form-control deviceDetails"
                                rows="3"
                                value={device.description || ''}
                            ></textarea>

                            <h5>Application</h5>
                            <textarea
                                id="application"
                                name="application"
                                className="form-control deviceDetails"
                                rows="3"
                                value={device.application || ''}
                            ></textarea>
                            <div className="row">
                                <div className="col-md-4">
                                    <h5>Category</h5>
                                    <input
                                        type="text"
                                        id="category"
                                        name="category"
                                        className="form-control deviceDetails"
                                        value={device.category || ''}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <h5>Model</h5>
                                    <input
                                        type="text"
                                        id="model"
                                        name="model"
                                        className="form-control deviceDetails"
                                        value={device.model || ''}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <h5>Brand</h5>
                                    <input
                                        type="text"
                                        id="brand"
                                        name="brand"
                                        className="form-control deviceDetails"
                                        value={device.brand || ''}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile_Message modal */}
            <Profile_Message
                show={showProfilePopup}
                onHide={() => setShowProfilePopup(false)}
                personInChargeName={personInChargeName}
            />
        </>
    );
};

export default ViewPage;
