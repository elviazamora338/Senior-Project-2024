// Import React and necessary hooks
import React from 'react';
import { Link } from 'react-router-dom';
import './All_Page.css'
import banner from '../../static/uni_banner/utrgv_banner.jpg'; // Import image from source
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

const All_Page = () => {
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
                                    <i className>Change University</i>
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
                        {/* Search Bar */}
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
                        {/* Filter */}
                        <button type="button" className="btn btn-outline-secondary filter">
                            <i className="bi bi-funnel-fill"></i> Filter
                        </button>
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
                                            <th>Item</th>
                                            <th>Description</th>
                                            <th>Time</th>
                                            <th><></>
                                            </th>
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
                                            <td>Time Data</td>
                                            <td className="bookmark-cell">
                                                <div className="bookmark">
                                                    <input type="checkbox" id="bookmark1"></input>
                                                    <label for="bookmark1"></label>
                                                </div>
                                            </td>
                                        </tr>
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

