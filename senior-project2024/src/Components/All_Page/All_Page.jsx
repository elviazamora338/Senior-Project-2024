import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ViewPage from '../View_Equipment/View_Equipment.jsx';
import './All_Page.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import Pagination from '../Pagination.jsx'; // Import Pagination Component
import axios from 'axios';

const All_Page = () => {
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
 
    const handleShowDevice = (device) => {
        setSelectedDevice(device);
        setShowDevice(true);
    };

    const handleCloseDevice = () => {
        setSelectedDevice(null);
        setShowDevice(false);
    };

    // Bookmark function
    const handleBookmarkClick = (e, id) => {
        e.stopPropagation(); 
        setBookmarkedItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // Search function
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    useEffect(() => {
        const fetchLabDevices = async () => {
            setLoading(true)
            try {
                const response = await axios.get('http://localhost:5001/all');
                setLabDevices(response.data);
            } catch (error) {
                console.error('Error fetching lab devices:', error);
                setError('Failed to fetch lab devices');
            } finally {
                setLoading(false);
            }
        };
        fetchLabDevices();
    }, []);
    
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
                                            <td>
                                                {device.image_path ? (
                                                    <img
                                                        src={`http://localhost:5001/static/equipment_photos/${device.image_path}`}
                                                        alt={device.device_name}
                                                        className="item-image me-2"
                                                    />
                                                ) : (
                                                    <i className="bi bi-image item-image me-2"></i>
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
                size="xl"
            >
                <Modal.Body>
                    <ViewPage device={selectedDevice} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDevice}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    </>
    );  
};  

export default All_Page;