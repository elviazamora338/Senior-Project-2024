import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './History.css'
import axios from 'axios';
import ReportEquipment from './Report_Equipment.jsx'; 
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useUser } from '../../UserContext';
const HistoryPage = () => {
    const { user } = useUser();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeviceModal, setShowDeviceModal] = useState(false); // Modal control state
    const [selectedDevice, setSelectedDevice] = useState(null);   // Selected device state

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                // Fetch history from the API
                const response = await axios.get('http://localhost:5001/myHistory', {
                    params: { userId: user.user_id },
                });
    
                console.log('Response data:', response.data); // Debugging: Log the response data
    
                if (Array.isArray(response.data)) {
                    setHistory(response.data); // Only set if the data is an array
                } else {
                    console.error('Unexpected data format:', response.data);
                    setError('Received unexpected data format. Please contact support.');
                }
            } catch (err) {
                console.error('Error fetching history:', err.message);
                setError('Failed to fetch history. Please try again later.');
            } finally {
                setLoading(false); // Always set loading to false
            }
        };
    
        if (user.user_id) {
            fetchHistory();
        }
    }, [user.user_id]);
    
    const handleDeviceClick = (device_id) => {
        setSelectedDevice(device_id); // Pass device_id to the modal
        setShowDeviceModal(true);
        
    };
    

    const handleCloseDeviceModal = () => {
        setSelectedDevice(null); // Clear selected device
        setShowDeviceModal(false); // Close modal
    };

    if (loading) {
        return <p>Loading history...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }
    return (
        <>
        {/* Equipment Showcase */}
        <div className="col text-center">
                    <div className="btn-group">
                        <Link to="/home">
                            <button type="button" className="bi bi-check-lg text-dark btn btn-outline-dark buttons-right border-secondary"> Scheduled</button>
                        </Link>
                        <Link to="/history">
                            <button type="button" className="bi bi-box btn  text-dark btn btn-secondary middle-button"> History</button>
                        </Link>
                        <Link to="/bookmarks">
                            <button type="button" className="bi bi-bookmark-fill btn btn-outline-dark text-dark border-secondary buttons-left"> Bookmarks</button>
                        </Link>
                    </div>
                </div>

                {/* Table and Cancel Button */}
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="table-height">
                                <table className="table">
                                    <thead classname="thead-bg">
                                        <tr>
                                            <th>Image</th>
                                            <th>Item</th>
                                            <th>Description</th>
                                            <th class="text-nowrap">Last Booked</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((device) => (
                                             <tr key ={device.history_id} onClick={() => handleDeviceClick(device.device_id)}>
                                                <td className='image-height'>
                                                    {device.image_path ? (
                                                        <img
                                                            src={`http://localhost:5001/static/equipment_photos/${device.image_path}`}
                                                            alt={device.device_name}
                                                            className="item-image me-2"
                                                        />
                                                    ) : (
                                                    <i className="item-image bi bi-image me-2"></i>
                                                )}
                                            </td> 
                                                <td>{device.device_name}</td>
                                                <td>
                                                    <div className="description-content">
                                                        <div className="description-item">
                                                            <span className="description-label">Model Info:</span>
                                                            <span className="description-value">{device.description}</span>
                                                        </div>
                                                        <div className="description-item">
                                                            <span className="description-label">Person In Charge:</span>
                                                            <span className="description-value">{device.person_in_charge}</span>

                                                        </div>
                                                        <div className="description-item">
                                                            <span className="description-label">Building:</span>
                                                            <span className="description-value">{device.building}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="text-secondary">
                                                {/* <p style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '4px' }}>Last Booked:</p> */}
                                                <div>{device.booking_date}</div>
                                                <div style={{ fontSize: '15px'}}>@{device.booking_time}</div>

                                                </td>
                                            </tr>
                                        ))}
                                       
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

export default HistoryPage;

