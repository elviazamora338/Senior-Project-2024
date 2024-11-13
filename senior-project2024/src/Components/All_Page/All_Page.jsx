import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './All_Page.css';
import banner from '../../static/uni_banner/utrgv_banner.jpg'; // Import image from source
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from 'axios'; 

const All_Page = () => {
    const [labDevices, setLabDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookmarkedItems, setBookmarkedItems] = useState({}); // Use an object for bookmarking by device id
    const [searchTerm, setSearchTerm] = useState(''); 

    // function for bookmark 
    const handleBookmarkClick = (id) => {
        setBookmarkedItems((prev) => ({
            ...prev,
            [id]: !prev[id], // Toggle bookmark for the specific device id
        }));
    }; 
    
    // 
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase())
    }
    useEffect(() => {
        const fetchLabDevices = async () => {
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    // Filter devices based on the search
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


    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div className="sidebar flex-shrink-0 p-3">
                <ul className="nav">
                    <br />
                    <li className="nav-item nav-icon">
                        <Link to="/home" className="nav-link text-white">
                            <div className="nav-icon">
                                <i className="bi bi-house-door"></i>
                            </div>
                            <span>Home</span>
                        </Link>
                    </li>
                    <li className="nav-item nav-icon">
                        <Link to="/all" className="nav-link text-white">
                            <div className="nav-icon">
                                <i className="bi bi-grid"></i>
                            </div>
                            <span>All</span>
                        </Link>
                    </li>
                    <li className="nav-item nav-icon">
                        <Link to="/add" className="nav-link text-white">
                            <div className="nav-icon">
                                <i className="bi bi-plus-circle"></i>
                            </div>
                            <span>Add</span>
                        </Link>
                    </li>
                    <li className="nav-item nav-icon">
                        <Link to="/inventory" className="nav-link text-white">
                            <div className="nav-icon">
                                <i className="bi bi-box"></i>
                            </div>
                            <span>My Equipment</span>
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="container-fluid p-0 table-content">
                {/* Header */}
                <div className="card card-custom mb-0">
                    <div className="card-body table-header">
                        <div className="row">
                            <div className="col-sm-8"></div>
                            <div className="col-sm-4">
                                <div className="d-flex justify-content-end text-over text-white">
                                    <i classname>Change University</i>
                                    <i className="text-black bi bi-paperclip mx-2"></i>
                                    <i className="text-black bi bi-calendar4-event mx-2"></i>
                                    <i className="text-black bi-three-dots-vertical mx-2"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* University Banner */}
                <div className="container container-banner mt-3">
                    <div className="img-container">
                        <img src={banner} alt="UTRGV logo banner" />
                        <div className="text-overlay">
                            <h1>Equipment Scheduler</h1>
                            <br></br>
                        </div>
                        <div className="button-container">
                            <button className="btn btn-light btn-custom">
                                <i className="bi bi-calendar4-event"></i> Add to my itinerary
                            </button>
                            <button className="btn btn-light btn-custom">
                                <i className="bi bi-person-walking"></i> 12 min from current location
                            </button>
                        </div>
                    </div>
                </div>

                    {/* Search Equipment Bar */}
                    <div className="container">
                        <div className="d-flex justify-content-end mb-3">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    aria-label="Search"
                                    id="search-input"
                                    // Bind input to searchTerm
                                    value={searchTerm}
                                    // Update searchTerm on change
                                    onChange={handleSearchChange}
                                />
                                <button className="btn btn-outline-secondary" type="button" id="search-button">
                                    <i className="bi bi-search"></i>
                                </button>
                            </div>
                        <button type="button" className="btn btn-outline-secondary filter">
                                <i className="bi bi-funnel-fill"></i> Filter
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="container mt-4">
                        <div className="row">
                            <div className="col">
                                <div className="table-height">
                                    <table className="table">
                                        <thead className="thead-bg">
                                            <tr>
                                                <th>Image</th>
                                                <th>Item</th>
                                                <th>Description</th>
                                                <th>Available</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredDevices.map((device) => (
                                                <tr key={device.device_id}>
                                                    <td>
                                                        <div>
                                                            {device.image_path ? (
                                                                <img
                                                                    src={`http://localhost:5001/static/equipment_photos/${device.image_path}`}
                                                                    alt={device.device_name}
                                                                    className="item-image me-2"
                                                                    style={{ width: '150px', height: 'auto' }}
                                                                />
                                                            ) : (
                                                                <i className="bi bi-image item-image me-2"></i>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>{device.device_name}</td>
                                                    <td className='text-center'>
                                                        <div className='description-content'>
                                                            <div className='description-item'>
                                                                <span className='description-label'>Model Info:</span>
                                                                <span className='description-value'>{device.description}</span>
                                                            </div>
                                                            <div className='description-item'>
                                                                <span className='description-label'>Person In Charge:</span>
                                                                <span className='description-value'>{device.person_in_charge}</span>
                                                            </div>
                                                            <div className='description-item'>
                                                                <span className='description-label'>Building:</span>
                                                                <span className='description-value'>{device.building}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">{device.available ? 'Yes' : 'No'}</td>
                                                    <td className="bookmark-cell">
                                                        <div className="bookmark"
                                                            onClick={() => handleBookmarkClick(device.device_id)}
                                                            style={{ cursor: 'pointer' }}>
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

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
    );
};

export default All_Page;