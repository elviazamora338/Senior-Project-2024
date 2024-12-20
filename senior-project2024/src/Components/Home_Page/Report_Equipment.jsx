import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import './Report_Equipment.css';
import Profile_Message from "../Profile_Page/Profile_Message.jsx";
import { useUser } from '../../UserContext.js';

const ReportEquipment = ({ device_id, onHide }) => { 
    const [device, setDevice] = useState(null); // State to store fetched device data
    const [loading, setLoading] = useState(true); // Loading state
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const [showReportProblemModal, setShowReportProblemModal] = useState(false); // State for report problem modal
    const [personInChargeName, setPersonInChargeName] = useState(''); // State for person in charge name
    const [issueDescription, setIssueDescription] = useState(''); // For issue description input
    const { user } = useUser(); // Access user details from UserContext

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

    // Handle Report Problem submission
    const handleReportProblem = async (e) => {
        e.preventDefault();
    
        const reportData = {
            device_id: device.device_id,
            device_name: device.device_name,
            owner_name: device.person_in_charge,
            reporter_id: user.user_id,
            reporter_name: user.user_name,
            reporter_email: user.user_email,
            issue_description: issueDescription,
            status: 'pending', // Default status
        };
    
        try {
            // Submit the report
            const response = await axios.post('http://localhost:5001/reports', reportData);
            alert(response.data.message || 'Report submitted successfully.');
    
            // Fetch the unavailability_id using device_id
            const unavailabilityResponse = await axios.get(
                `http://localhost:5001/unavailable/by-device/${device.device_id}`
            );
            const unavailabilityId = unavailabilityResponse.data.unavailability_id;
    
            // if (unavailabilityId) {
            //     // Delete the unavailability record
            //     await axios.delete(`http://localhost:5001/unavailable/${unavailabilityId}`);
            //     alert('Scheduled booking removed successfully.');

            //     // Refresh the page
            //     window.location.reload();
            // } else {
            //     alert('No scheduled booking found to remove.');
            // }
    
            setShowReportProblemModal(false); // Close the modal on success
            setIssueDescription(''); // Reset the issue description field
        } catch (error) {
            console.error('Error submitting report or deleting booking:', error.message);
            alert('Failed to submit report or delete scheduled booking. Please try again.');
        }
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
                                    className="img-preview"
                                    alt={device.device_name || 'No image available'}
                                    style={{
                                        maxWidth: '100%',
                                        height: 'auto',
                                        objectFit: 'contain',
                                        borderRadius: '5px',
                                    }}
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

            <div className="d-flex justify-content-end p-3">
                <Button variant="danger" onClick={() => setShowReportProblemModal(true)}>
                    Report Problem
                </Button>
            </div>

            {/* Profile_Message modal */}
            <Profile_Message
                show={showProfilePopup}
                onHide={() => setShowProfilePopup(false)}
                personInChargeName={personInChargeName} // Pass the person in charge name
                equipmentName={device?.device_name} // Pass the equipment name
            />

            {/* Report Problem Modal */}
            <Modal
                show={showReportProblemModal}
                onHide={() => setShowReportProblemModal(false)}
                centered
            >
                <Modal.Header>
                    <Modal.Title>
                        Report Problem
                    </Modal.Title>
                    <Button
                        variant="link"
                        className="btn-close"
                        onClick={() => setShowReportProblemModal(false)}
                    />
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleReportProblem}>
                        <div className="mb-3">
                            <label className="form-label">Equipment ID/Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={device.device_name || ''}
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Person In-Charge</label>
                            <input
                                type="text"
                                className="form-control"
                                value={device.person_in_charge || ''}
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Reporter Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={user.user_name || ''}
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Reporter Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={user.user_email || ''}
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Issue Description</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={issueDescription}
                                onChange={(e) => setIssueDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <Button variant="danger" type="submit">
                            Report Problem
                        </Button>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ReportEquipment;

