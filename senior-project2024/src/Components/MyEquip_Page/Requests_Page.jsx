// Import React and necessary hooks
import React from 'react';
import { Link } from 'react-router-dom';
import './Requests_Page.css'
import banner from '../../static/uni_banner/utrgv_banner.jpg';  // Import image from source
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

const RequestsPage = () => {
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
                        <Link to="/requests" className="nav-link text-white">
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

                {/* Requests and Inventory Buttons */}
                <div className="col text-center m-3">
                    <div className="btn-group">
                        <Link to="/requests">
                            <button type="button" className="bi bi-clock btn btn-secondary text-dark btn buttons-right"> Requests</button>
                        </Link>
                        <Link to="/inventory">
                            <button type="button" className="bi bi-clipboard-fill btn btn-outline-dark text-dark border-secondary buttons-left"> Inventory</button>
                        </Link>
                    </div>
                </div>

                {/* Table begins here */}
                <div className="container mt-4">
                    <div className="row" >
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
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Jane Doe</td>
                                            <td>jane.doe@utrgv.edu</td>
                                            <td>Equipment Name</td>
                                            <td>Approved</td>
                                            <td>
                                                <div>
                                                <button type="button" className="btn btn-secondary btn-sm">View</button>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>John Doe</td>
                                            <td>john.doe@utrgv.edu</td>
                                            <td>Equipment Name</td>
                                            <td>Pending Approval</td>
                                            <td>
                                                <div>
                                                    <button type="button" className="bi bi-x btn btn-danger btn-sm me-2"></button>
                                                    <button type="button" className="bi bi-check2 btn btn-success btn-sm me-2"></button>
                                                    <button type="button" className="btn btn-secondary btn-sm">View</button>
                                                </div>
                                            </td>
                                        </tr>
                                        {/* end of table */}
                                        
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

export default RequestsPage;

