// Import React and necessary hooks
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Bookmarks.css'
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useUser} from '../../UserContext';
import Pagination from '../Pagination.jsx';
import axios from 'axios';
import ViewPage from '../View_Equipment/View_Equipment.jsx';

const BookmarksPage = () => {
    const { user } = useUser();
    const [labDevices, setLabDevices] = useState([]);
    const [bookmarkedItems,  setBookmarkedItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDevice, setShowDevice] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null); // Add state for the selected device
    const [currentPage, setCurrentPage] = useState(1); // Pagination state
    const postsPerPage = 8; // Items per page


    
    const handleShowDevice = (device) => {
        setSelectedDevice(device);
        setShowDevice(true);
    };

    const handleCloseDevice = () => {
        setSelectedDevice(null);
        setShowDevice(false);
    };

      // Bookmark function
 const handleBookmarkClick = async (e, id) => {
    e.stopPropagation(); 
    console.log("Toggling bookmark for Device ID:", id);
    try {
        const response = await axios.post('http://localhost:5001/bookmarked', {
            newid: id,
            userid: user.user_id
        });
        if (response.data.success) {
            console.log("Bookmark toggled successfully on the server.");
            setBookmarkedItems((prev) => ({
                ...prev,
                [id]: response.data.newToggle === 1, // Reflect the new toggle state
            }));
        } else {
            console.error("Failed to toggle bookmark on the server.");
        }
    } catch (e) {
        console.error("Error toggling bookmark:", e);
    }
};

    useEffect(() => {
        const fetchData = async() => {
            setLoading(true);
            try{
                const [devicesResponse, bookmarksResponse] = await Promise.all([
                    axios.get('http://localhost:5001/all'),
                    axios.get('http://localhost:5001/toggled', {
                        params: {userid: user.user_id},
                    }),
                ]);
                const allDevices = devicesResponse.data;
                const bookmarkedIds = bookmarksResponse.data.bookmarks;

                // Filtering Devices that match bookmarked IDs
                const filterDevices = allDevices.filter(devices =>
                    bookmarkedIds.includes(devices.device_id)
                );

                //Only display bookmarked devices
                setLabDevices(filterDevices);

                // Prepare bookmark state
                const bookmarkState = bookmarksResponse.data.bookmarks.reduce((acc, deviceId) => {
                acc[deviceId] = true; // Mark device as bookmarked
                return acc;
            }, {});
    
                setBookmarkedItems(bookmarkState);
            }
            catch(error){
                console.error('Error fetching data', error);
                setError('Faled to fetch data');
            }
            finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user.user_id]);


  
    const handlePagination = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    // Paginate devices
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentDevices = labDevices.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <>
            <div className="col text-center">
                <div className="btn-group">
                    <Link to="/home">
                        <button type="button" className="bi bi-check-lg btn text-dark btn btn-outline-dark buttons-right"> Scheduled</button>
                    </Link>
                    <Link to="/history">
                        <button type="button" className="bi bi-box btn text-dark border-secondary btn-outline-dark middle-button"> History</button>
                    </Link>
                    <Link to="/bookmarks">
                        <button type="button" className="bi bi-bookmark-fill btn text-dark border-secondary buttons-left btn-secondary"> Bookmarks</button>
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
                                            <th>Bookmark</th>
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
                                                    className="bookmark click d-flex justify-content-end mr-4 mb-4"
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
                                    length={labDevices.length}
                                    handlePagination={handlePagination}
                                    currentPage={currentPage}
                                />
                            </div>
                    </div>
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
        </>
    );
};

export default BookmarksPage;
