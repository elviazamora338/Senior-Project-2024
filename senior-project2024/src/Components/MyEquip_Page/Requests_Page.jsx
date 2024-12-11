import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Requests_Page.css';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from 'axios'; // For making API calls
import Pagination from '../Pagination.jsx'; 
import { useUser } from '../../UserContext';

const RequestsPage = () => {
    const { user } = useUser(); 
    const [requests, setRequests] = useState([]); // State to hold requests
    const [showBookingRequestModal, setShowBookingRequestModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null); // State for selected request
    const [deleteButton, setShowDeleteButton] = useState(false);

     // Pagination state
     const [currentPage, setCurrentPage] = useState(1);
     const [itemsPerPage] = useState(5); // Number of items per page
    
    // Fetch booking requests for the logged-in owner
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/requests?owner_id=${user.user_id}`);
                console.log('Requests Data:', response.data); // Log the data from the API
    
                // Sort the requests in descending order based on request_date (most recent first)
                const sortedRequests = response.data.sort((a, b) => {
                    const dateA = new Date(a.schedule_id);
                    const dateB = new Date(b.schedule_id);
                    return dateB - dateA; // Sort descending
                });
    
                setRequests(sortedRequests);
            } catch (error) {
                console.error('Error fetching requests:', error.message);
            }
        };
        fetchRequests();
    }, [user.user_id]);
    
    

    // Handle booking confirmation by the owner
    const handleOwnerResponse = async (requestId, action) => {
        try {
            const status = action === 'approve' ? 'approved' : 'rejected';
    
            // Update booking request status
            await axios.patch(`http://localhost:5001/requests/${requestId}`, { status });
    
            if (action === 'approve') {
                // Find the approved request details
                const approvedRequest = requests.find((request) => request.schedule_id === requestId);
                console.log('Approved Request:', approvedRequest);
                
                // Prepare unavailability data
                const unavailabilityData = {
                    device_id: approvedRequest.device_id,
                    owner_id: user.user_id,
                    student_id: approvedRequest.student_id,
                    date: approvedRequest.request_date, // Ensure this exists in request data
                    time_range: approvedRequest.request_time, // Ensure this exists in request data
                    period: 'Day',
                }; 


                console.log('Data:', unavailabilityData);
                // Insert into unavailable table
                await axios.post('http://localhost:5001/unavailable', unavailabilityData);
            }
            // Update UI after response
            setRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request.schedule_id === requestId ? { ...request, status } : request
                )
            );
            handleShowDeleteButton(true);
        } catch (error) {
            console.error('Error updating request status or adding unavailability:', error.message);
        }
    };
    

    const handleShowBookingRequestModal = (request) => {
        setSelectedRequest(request);
        setShowBookingRequestModal(true);
    };

    const handleCloseBookingRequestModal = () => {
        setShowBookingRequestModal(false);
        setSelectedRequest(null);
    };

    const handleShowDeleteButton = () => {
        setShowDeleteButton(true);
    }

    const handleDeleteButton = async (scheduleId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this item?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5001/requests/${scheduleId}`);
            setRequests((prevItems) =>
                prevItems.filter((item) => item.schedule_id !== scheduleId)
            );
            console.log('Item deleted successfully');
        } catch (error) {
            console.error('Error deleting request:', error.message);
        }
    }

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRequests = requests.slice(indexOfFirstItem, indexOfLastItem);

    const handlePagination = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            {/* Requests and Inventory Buttons */}
            <div className="col text-center">
                <div className="btn-group">
                    <Link to="/requests">
                        <button type="button" className="bi bi-clock btn btn-secondary text-dark btn buttons-right"> Requests</button>
                    </Link>
                    <Link to="/reports">
                        <button type="button" className="bi bi-box btn text-dark btn btn-outline-dark middle-button"> Reports</button>
                    </Link>
                    <Link to="/inventory">
                        <button type="button" className="bi bi-clipboard-fill btn btn-outline-dark text-dark border-secondary buttons-left"> Inventory</button>
                    </Link>
                </div>
            </div>

            {/* Requests Table */}
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="requests">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Device/Equipment</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentRequests.length > 0 ? (
                                        currentRequests.map((request) => (
                                            <tr key={request.schedule_id}>
                                                <td>{request.student_name}</td>
                                                <td>{request.student_email}</td>
                                                <td>{request.device_name}</td>
                                                <td>{request.status}</td>
                                                <td>
                                                    <div>
                                                        {request.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    className="bi bi-check2 btn btn-success btn-sm me-2"
                                                                    onClick={() => handleOwnerResponse(request.schedule_id, 'approve')}
                                                                >
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="bi bi-x btn btn-danger btn-sm me-2"
                                                                    onClick={() => handleOwnerResponse(request.schedule_id, 'reject')}
                                                                >
                                                                </button>
                                                            </>
                                                        )}
                                                        <button 
                                                            type="button" 
                                                            className="btn btn-secondary btn-sm"
                                                            onClick={() => handleShowBookingRequestModal(request)}
                                                        >
                                                            View
                                                        </button>
                                                        {['approved', 'rejected'].includes(request.status) && (
                                                        <button 
                                                            type="button" 
                                                            className="btn btn-danger btn-sm bi bi-trash deleteButton"
                                                            onClick={() => handleDeleteButton(request.schedule_id)}
                                                        ></button>
                                                    )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6">No requests available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                        {/* Pagination */}
                        <div className="d-flex justify-content-end mr-4 mb-4">
                            <Pagination
                                postsPerPage={itemsPerPage}
                                length={requests.length}
                                handlePagination={handlePagination}
                                currentPage={currentPage}
                            />
                        </div>
                </div>
            </div>

            {/* Booking Request Modal */}
            <Modal 
                show={showBookingRequestModal} 
                onHide={handleCloseBookingRequestModal}
                backdrop="static" // Prevent closing on backdrop click
                keyboard={false} // Prevent closing with Escape key
            >
                <Modal.Header>
                    <Modal.Title>Booking Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRequest ? (
                        <>
                            <p>
                                <strong>Name:</strong> {selectedRequest.student_name}
                            </p>
                            <p>
                                <strong>Email:</strong> {selectedRequest.student_email}
                            </p>
                            <p>
                                <strong>Device/Equipment:</strong> {selectedRequest.device_name}
                            </p>
                            <p>
                                <strong>Reason:</strong> {selectedRequest.reason}
                            </p>
                            <p>
                                <strong>Date:</strong> {selectedRequest.request_date}
                            </p>
                            <p>
                                <strong>Time:</strong> {selectedRequest.request_time}
                            </p>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseBookingRequestModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default RequestsPage;
