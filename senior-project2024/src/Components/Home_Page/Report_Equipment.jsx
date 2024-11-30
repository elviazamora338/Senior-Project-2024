import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import './Report_Equipment.css';
import Profile_Message from "../Profile_Page/Profile_Message.jsx";

const ReportEquipment = ({ device_id }) => {
    const [device, setDevice] = useState(null); // State to store fetched device data
    const [loading, setLoading] = useState(true); // Loading state
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const [personInChargeName, setPersonInChargeName] = useState('');

    // Fetch device data when component mounts or device_id changes
    useEffect(() => {
        const fetchDeviceData = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/device/${device_id}`);
                setDevice(response.data);
            } catch (error) {
                console.error('Error fetching device data:', error.message);
            } finally {
                setLoading(false);
            }
        };

        if (device_id) {
            fetchDeviceData();
        }
    }, [device_id]);

    // Handle "Person in Charge" click
    const handlePersonInChargeClick = () => {
        setPersonInChargeName(device?.person_in_charge || 'N/A');
        setShowProfilePopup(true);
    };

    if (loading) return <p>Loading device data...</p>;
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
                                        className="item-image me-2"
                                        alt={device.device_name}
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
                                        readOnly
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
                                        readOnly
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
                                        readOnly
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
                                        readOnly
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
                                readOnly
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
                                readOnly
                            ></textarea>

                            <h5>Application</h5>
                            <textarea
                                id="application"
                                name="application"
                                className="form-control deviceDetails"
                                rows="3"
                                value={device.application || ''}
                                readOnly
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
                                        readOnly
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
                                        readOnly
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
                                        readOnly
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
                equipmentName={device.device_name} // Pass the equipment name
            />
        </>
    );
};

export default ReportEquipment;
