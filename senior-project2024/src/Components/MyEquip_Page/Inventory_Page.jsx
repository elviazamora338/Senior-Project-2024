import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Inventory_Page.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import Pagination from '../Pagination.jsx'; 
import { useUser } from '../../UserContext';

const InventoryPage = () => {
    const { user } = useUser(); 
    const [inventory, setInventory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; 
    const navigate = useNavigate();


    useEffect(() => {
        if (user && user.user_name) {
            fetchInventory();
        }
    }, [user]);

    // Fetch inventory data
    const fetchInventory = () => {
        axios.get('http://localhost:5001/inventory', { params: { person_in_charge: user.user_name } })
            .then((response) => {
                setInventory(response.data);
            })
            .catch((error) => {
                console.error('Error fetching inventory:', error);
            });
    };

    // Handle delete row
    const handleDelete = (device_id) => {
        if (window.confirm(`Are you sure you want to delete this item?`)) {
            axios
                .delete(`http://localhost:5001/inventory/${device_id}`)
                .then((response) => {
                    console.log(response.data.message);
                    // Refresh the inventory list after deletion
                    fetchInventory();
                })
                .catch((error) => {
                    console.error('Error deleting device:', error);
                });
        }
    };

    // Get current items for the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = inventory.slice(indexOfFirstItem, indexOfLastItem);

    // Handle pagination
    const handlePagination = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            {/* Navigation Buttons */}
            <div className="col text-center">
                <div className="btn-group">
                    <Link to="/requests">
                        <button type="button" className="bi bi-clock btn-outline-dark text-dark btn buttons-right"> Requests</button>
                    </Link>
                    <Link to="/reports">
                        <button type="button" className="bi bi-box btn text-dark btn btn-outline-dark middle-button"> Reports</button>
                    </Link>
                    <Link to="/inventory">
                        <button type="button" className="bi bi-clipboard-fill btn btn-secondary btn text-dark border-secondary buttons-left"> Inventory</button>
                    </Link>
                </div>
            </div>

            {/* Table */}
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="table-height">
                            <table className="table">
                                <thead className="thead-bg">
                                    <tr>
                                        <th>Image</th>
                                        <th>Device/Equipment</th>
                                        <th>Description</th>
                                        <th>Number Available</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((item) => (
                                        <tr key={item.device_id}>
                                            <td className="image-height">
                                                {item.image_path ? (
                                                    <img
                                                        src={`http://localhost:5001/static/equipment_photos/${item.image_path}`}
                                                        alt={item.device_name}
                                                        className="item-image me-2"
                                                    />
                                                ) : (
                                                    <i className="item-image bi bi-image me-2"></i>
                                                )}
                                            </td>
                                            <td>{item.device_name}</td>
                                            <td>
                                                <div className="description-content">
                                                    <div className="description-item">
                                                        <span className="description-value">{item.description}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{item.available}</td>
                                            <td className="checkbox-cell">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={() => navigate(`/inventory/update/${item.device_id}`)}
                                                    >
                                                    Update
                                                </button>
                                                <i
                                                    className="bi bi-trash-fill text-danger ms-3 delete-icon"
                                                    onClick={() => handleDelete(item.device_id)}
                                                    style={{ cursor: 'pointer' }}
                                                ></i>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="d-flex justify-content-end mr-4 mb-4">
                            <Pagination
                                postsPerPage={itemsPerPage}
                                length={inventory.length}
                                handlePagination={handlePagination}
                                currentPage={currentPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InventoryPage;

