import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './All_Page.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from 'axios';

const All_Page = () => {
    const [labDevices, setLabDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookmarkedItems, setBookmarkedItems] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    const handleBookmarkClick = (id) => {
        setBookmarkedItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

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
        <>
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

            {/* Duplicate Search Equipment Bar */}
            <div className="container">
                <div className="d-flex justify-content-end mb-3">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            aria-label="Search"
                            id="search-input"
                            value={searchTerm}
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

            {/* Duplicate Table */}
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
                                    {labDevices.map((device) => (
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
        </>
    );
};

export default All_Page;
