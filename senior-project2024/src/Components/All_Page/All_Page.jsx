import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ViewPage from '../View_Equipment/View_Equipment.jsx';
import Book_Equipment from '../View_Equipment/Book_Equipment.jsx';
import './All_Page.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import Pagination from '../Pagination.jsx'; // Import Pagination Component
import { useUser } from '../../UserContext'; // Imports the custom hook
import axios from 'axios';

const All_Page = () => {
    const { user } = useUser(); // Access user from context
    const [labDevices, setLabDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookmarkedItems, setBookmarkedItems] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const postsPerPage = 8; // Number of items per page

    // Modal state
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [showDevice, setShowDevice] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
 
    const handleShowDevice = (device) => {
        console.log("Device to show:", device); // Debugging
        setSelectedDevice(device);
        setShowDevice(true);
    };

    const handleCloseDevice = () => setShowDevice(false);

    const handleCalendarClose = () => setShowCalendar(false);
    const handleCalendarShow = () => setShowCalendar(true);

    // Bookmark function
   const handleBookmarkClick =  async (e, id) => {
        e.stopPropagation(); 
       // To add bookmark to database
       console.log("Toggling bookmark for Device ID:", id);
        try {
            const response = await axios.post('http://localhost:5001/bookmarked', {
                newid: id,
                userid: user.user_id
            });
            if(response.data.success) {
                console.log("bookmarked successful");
                // Update the bookmarkedItems state
                setBookmarkedItems((prev) => ({
                    ...prev,
                    [id]: response.data.newToggle === 1, // Reflect the new toggle state
                }));
            }
            else {
                console.error("Failed to toggle bookmark");
            }          

        } catch (e) {
            if (e.response && e.response.status === 400) {
                console.log(e.response.data.error); // Display duplicate user error
            }
        }
    };
    

    // Search function
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [devicesResponse, bookmarksResponse] = await Promise.all([
                    axios.get('http://localhost:5001/all'),
                    axios.get('http://localhost:5001/toggled', {
                        params: { userid: user.user_id }, // Pass userid as a query parameter
                    }),
                ]);
    
                // Set lab devices
                setLabDevices(devicesResponse.data);
    
                // Prepare bookmark state
                const bookmarkState = bookmarksResponse.data.bookmarks.reduce((acc, deviceId) => {
                    acc[deviceId] = true; // Mark device as bookmarked
                    return acc;
                }, {});
    
                setBookmarkedItems(bookmarkState);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [user.user_id]);
    
    // Set pagination 
    const handlePagination = (pageNumber) => {
        setCurrentPage (pageNumber);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    // Filter devices based on search term
    const filteredDevices = labDevices.filter((device) => {
        const deviceName = device.device_name.toLowerCase();
        const description = device.description.toLowerCase();
        const building = device.building.toLowerCase();
        const poc = device.person_in_charge.toLowerCase();
        return (
            deviceName.includes(searchTerm) ||
            description.includes(searchTerm) ||
            building.includes(searchTerm) ||
            poc.includes(searchTerm)
        );
    });

    // Paginate devices
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentDevices = filteredDevices.slice(indexOfFirstPost, indexOfLastPost);

    

    return (
        <>
            {/* Search Bar */}
            <div className="d-flex justify-content-end">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                        aria-label="Search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button className="btn btn-outline-secondary" type="button">
                        <i className="bi bi-search"></i>
                    </button>
                </div>
                <button type="button" className="btn btn-outline-secondary filter">
                    <i className="bi bi-funnel-fill"></i> Filter
                </button>
            </div>
    
            {/* Table */}
                <div className="row">
                    <div className="col">
                        <div className="table-height">
                            <table className="table">
                                <thead className="thead-bg">
                                    <tr>
                                        <th>Image</th>
                                        <th>Item</th>
                                        <th>Description</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentDevices.map((device) => (
                                        <tr key={device.device_id} onClick={() => handleShowDevice(device)}>
                                            <td className="image-height">
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
                                            <td className="bookmark-cell">
                                                <div
                                                    className="bookmark click"
                                                    onClick={(e) => handleBookmarkClick(e, device.device_id)}
                                                >
                                                    {bookmarkedItems[device.device_id] ? (
                                                        <i className="bi bi-bookmark-fill text-primary"></i>
                                                    ) : (
                                                        <i className="bi bi-bookmark text-secondary"></i>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="d-flex justify-content-end mr-4 mb-4">
                            <Pagination
                                postsPerPage={postsPerPage}
                                length={filteredDevices.length}
                                handlePagination={handlePagination}
                                currentPage={currentPage}
                            />
                        </div>
                    </div>


            {/* Modal for Viewing Device Details */}
            <Modal
                show={showDevice}
                onHide={handleCloseDevice}
                centered
                dialogClassName="custom-wide-modal"
                size="xl" >
                    
                <Modal.Header closeButton>
                    <Modal.Title>Equipment Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ViewPage device={selectedDevice} />
                </Modal.Body>
                <Modal.Footer>
                <Button 
                    variant="secondary" 
                    onClick={() => {
                        handleCloseDevice();
                        handleCalendarShow();
                    }}
                >
                    <i className="bi bi-arrow-right"></i>
                </Button>
                </Modal.Footer>
            </Modal>

            {/* Calendar Modal */}
            <Modal 
                show={showCalendar} 
                onHide={handleCalendarClose} 
                centered dialogClassName="custom-wide-modal"  
                size="xl" >

                <Modal.Header closeButton>
                    <Modal.Title>Select Dates</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Render the Calendar Component */}
                    <Book_Equipment />
                </Modal.Body>
                <Modal.Footer>
                <Button 
                    variant="secondary" 
                    onClick={() => {
                        handleCalendarClose(); // Close Calendar modal
                        if (selectedDevice) {
                            setShowDevice(true); // Reopen Equipment Information modal
                        } else {
                            console.error("No device selected to navigate back.");
                        }
                    }}
                >
                    <i className="bi bi-arrow-left"></i>
                </Button>
                    <Button variant="primary" onClick={handleCalendarClose}>
                        Submit Booking
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    </>
    );  
};  

export default All_Page;