// Import React and necessary hooks
import React from 'react';
import { Link } from 'react-router-dom';
import './Requests_Page.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

const RequestsPage = () => {
    return (
        <>

                {/* Requests and Inventory Buttons */}
                <div className="col text-center">
                    <div className="btn-group">
                        <Link to="/requests">
                            <button type="button" className="bi bi-clock btn btn-outline-dark text-dark btn buttons-right"> Requests</button>
                        </Link>
                        <Link to="/reports">
                            <button type="button" className="bi bi-box btn text-dark btn btn-secondary middle-button"> Reports</button>
                        </Link>
                        <Link to="/inventory">
                            <button type="button" className="bi bi-clipboard-fill btn btn-outline-dark text-dark border-secondary buttons-left"> Inventory</button>
                        </Link>
                    </div>
                </div>

                {/* Table begins here */}
                <div className="container">
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
                                            <td>Resolved</td>
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
                                            <td>Unresolved</td>
                                            <td>
                                                <div>
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
                </>
    );
};

export default RequestsPage;
