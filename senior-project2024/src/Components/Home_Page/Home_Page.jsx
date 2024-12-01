import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import ReportEquipment from './Report_Equipment.jsx'; // Corrected import
import './Home_Page.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useUser } from '../../UserContext';

const HomePage = () => {
    const { user } = useUser(); 
    const [scheduledItems, setScheduledItems] = useState([]);
    const [showDeviceModal, setShowDeviceModal] = useState(false); // Modal control state
    const [selectedDevice, setSelectedDevice] = useState(null);   // Selected device state

    useEffect(() => {
        const fetchScheduledData = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/scheduled?student_id=${user.user_id}`);
                console.log('Scheduled Items:', response.data); // Log the API response
                setScheduledItems(response.data);
            } catch (error) {
                console.error('Error fetching scheduled data:', error.message);
            }
        };

        fetchScheduledData();
    }, [user.user_id]);

    const handleCancel = async (unavailabilityId) => {
        const confirmCancel = window.confirm('Are you sure you want to cancel this item?');
        if (!confirmCancel) return;
    
        try {
            await axios.delete(`http://localhost:5001/unavailable/${unavailabilityId}`);
            setScheduledItems((prevItems) =>
                prevItems.filter((item) => item.unavailability_id !== unavailabilityId)
            );
        } catch (error) {
            console.error('Error canceling scheduled item:', error.message);
        }
    };

    const handleDeviceClick = (device_id) => {
        setSelectedDevice(device_id); // Pass device_id to the modal
        setShowDeviceModal(true);
    };
    

    const handleCloseDeviceModal = () => {
        setSelectedDevice(null); // Clear selected device
        setShowDeviceModal(false); // Close modal
    };

    return (
        <>
            <div className="col text-center">
                <div className="btn-group">
                    <Link to="/home">
                        <button type="button" className="bi bi-check-lg btn btn-secondary text-dark btn buttons-right">Scheduled</button>
                    </Link>
                    <Link to="/history">
                        <button type="button" className="bi bi-box btn text-dark border-secondary btn-outline-dark middle-button">History</button>
                    </Link>
                    <Link to="/bookmarks">
                        <button type="button" className="bi bi-bookmark-fill btn text-dark border-secondary buttons-left btn-outline-dark">Bookmarks</button>
                    </Link>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="table-height">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Item</th>
                                        <th>Time</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scheduledItems.length > 0 ? (
                                        scheduledItems.map((item) => (
                                            <tr key={item.unavailability_id} onClick={() => handleDeviceClick(item.device_id)}>
                                                <td>
                                                    <img src={`http://localhost:5001/static/equipment_photos/${item.image_path}`} className="item-image" alt={item.device_name} />
                                                </td>
                                                <td>{item.device_name}</td>
                                                <td>{item.date} @ {item.time_range}</td>
                                                <td className="checkbox-cell">
                                                    <button
                                                        className="cancel-button"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent modal opening
                                                            handleCancel(item.unavailability_id);
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center">No scheduled items found.</td>
                                        </tr>
                                    )}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for displaying device details */}
            <Modal
                show={showDeviceModal}
                onHide={() => setShowDeviceModal(false)}
                centered
                dialogClassName="custom-wide-modal"
                size="xl"
            >
                <Modal.Header>
                    <Modal.Title>
                        Equipment Information
                    </Modal.Title>
                    <Button
                        variant="link"
                        className="btn-close"
                        onClick={() => setShowDeviceModal(false)}
                    />
                </Modal.Header>   
                <Modal.Body>
                    {selectedDevice && <ReportEquipment device_id={selectedDevice} />} {/* Pass device_id */}
                </Modal.Body>
                
            </Modal>

        </>
    );
};

export default HomePage;
