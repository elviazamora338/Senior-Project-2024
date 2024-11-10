// Import React and necessary hooks
import React from 'react';
import { Link } from 'react-router-dom';
import './Inventory_Page.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

const InventoryPage = () => {
    return (
        <>
            {/* Requests and Inventory Buttons */}
            <div className="col text-center m-3">
                <div className="btn-group">
                    <Link to="/requests">
                        <button type="button" className="bi bi-clock btn-outline-dark text-dark btn buttons-right"> Requests</button>
                    </Link>
                    <Link to="/inventory">
                        <button type="button" className="bi bi-clipboard-fill btn btn-secondary btn text-dark border-secondary buttons-left"> Inventory</button>
                    </Link>
                </div>
            </div>

            {/* Table and Cancel Button */}
            <div className="container mt-4">
                <div className="row">
                    <div className="col">
                        <div className="table-height">
                            <table className="table">
                                <thead classname="thead-bg">
                                    <tr>
                                        <th>Image</th>
                                        <th>Device/Equipment</th>
                                        <th>Description</th>
                                        <th>Number Available</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div>
                                                <i className="bi bi-image item-image me-2"></i>
                                            </div>
                                        </td>
                                        <td>ITEM 1</td>
                                        <td>
                                            <div>
                                                Model Info
                                                <span className="bi bi-dot"></span>
                                                <span className="bi bi-clock"></span>
                                                <span className="bi bi-dot"></span>
                                                Building
                                            </div>
                                        </td>
                                        <td>2</td>
                                        <td className="checkbox-cell">
                                            <button type="button" className="btn btn-secondary">Edit</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InventoryPage;

