import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import ReportEquipment from './Report_Equipment.jsx';
import './Home_Page.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import Pagination from '../Pagination.jsx'; 
import { useUser } from '../../UserContext';

const HomePage = () => {
    const { user } = useUser(); 
    const [scheduledItems, setScheduledItems] = useState([]);
    const [showDeviceModal, setShowDeviceModal] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null); 

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        const fetchScheduledData = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/scheduled?student_id=${user.user_id}`);
                console.log('Scheduled Items:', response.data);

                // Get the current date
                const currentDate = new Date();

                // Filter out items where the scheduled date has passed
                const filteredItems = response.data.filter((item) => {
                    const scheduledDate = new Date(item.date + ' ' + item.time_range); // Combine date and time
                    return scheduledDate > currentDate; // Only keep items where the scheduled date is in the future
                });

                // Sort items by date and time in descending order
                const sortedItems = response.data.sort((a, b) => {
                    const dateA = new Date(a.date + ' ' + a.date);
                    const dateB = new Date(b.date + ' ' + b.date);
                    return dateB - dateA;
                });

                setScheduledItems(sortedItems);
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
        setSelectedDevice(device_id); 
        setShowDeviceModal(true);
    };

    const handleCloseDeviceModal = () => {
        setSelectedDevice(null);
        setShowDeviceModal(false);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = scheduledItems.slice(indexOfFirstItem, indexOfLastItem);
    
    // Pagination handler
    const handlePagination = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <div className="col text-center">
                <div className="btn-group">
                    <Link to="/home">
                        <button type="button" className="bi bi-check-lg btn btn-secondary text-dark btn buttons-right"> Scheduled</button>
                    </Link>
                    <Link to="/history">
                        <button type="button" className="bi bi-box btn text-dark border-secondary btn-outline-dark middle-button"> History</button>
                    </Link>
                    <Link to="/bookmarks">
                        <button type="button" className="bi bi-bookmark-fill btn text-dark border-secondary buttons-left btn-outline-dark"> Bookmarks</button>
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
                                    {currentItems.length > 0 ? (
                                        currentItems.map((item) => (
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
                                                            e.stopPropagation();
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

                        {/* Pagination */}
                        <div className="d-flex justify-content-end mr-4 mb-4">
                            <Pagination
                                postsPerPage={itemsPerPage}
                                length={scheduledItems.length} // Corrected: Use scheduledItems.length here
                                handlePagination={handlePagination}
                                currentPage={currentPage}
                            />
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
                    {selectedDevice && <ReportEquipment device_id={selectedDevice} />} 
                </Modal.Body>
            </Modal>
        </>
    );
};

export default HomePage;
