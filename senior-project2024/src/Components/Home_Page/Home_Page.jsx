// Import React and necessary hooks
import React from 'react';
import './Home_Page.css'
import banner from '/Users/anagarcia/Desktop/Projects/Senior-Project-2024/senior-project2024/src/static/uni_banner/utrgv_banner.jpg'; // Import image from source
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

const HomePage = () => {
    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div className="sidebar flex-shrink-0 p-3">
                <ul className="nav">
                    <br></br>
                    <li className="nav-item nav-icon">
                        <a href="/" className="nav-icon nav-link text-white bi bi-house-door">
                            <a className="nav-link text-white">Home</a>
                        </a>
                    </li>
                    <li className="nav-item nav-icon">
                        <a href="/lab_devices" className="nav-icon nav-link text-white bi bi-grid">
                            <a className="nav-link text-white">All</a>
                        </a>
                    </li>
                    <li className="nav-item nav-icon">
                        <a href="/add" className="nav-icon nav-link text-white bi bi-plus-circle">
                            <a className="nav-link text-white">Add</a>
                        </a>
                    </li>
                    <li className="nav-item nav-icon">
                        <a href="/inventory" className="nav-icon nav-link text-white bi bi-box">
                            <a className="nav-link text-white">My Equipment</a>
                        </a>
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

                {/* Equipment Showcase */}
                <div className="col text-center mt-3">
                    <div className="btn-group">
                        <button type="button" className="bi bi-check-lg btn btn-secondary text-dark btn btn-outline-dark buttons-right"> Scheduled
                        </button>
                        <button type="button" className="bi bi-box btn bg-light text-dark border-secondary"> History
                        </button>
                        <button type="button" className="bi bi-bookmark-fill btn bg-light text-dark border-secondary buttons-left"> Bookmarks
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
                                            <th>
                                                <button type="button" className="rounded-pill text-white cancel-button border-secondary">Cancel</button>
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
                                            <td className="checkbox-cell">
                                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
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

export default HomePage;

