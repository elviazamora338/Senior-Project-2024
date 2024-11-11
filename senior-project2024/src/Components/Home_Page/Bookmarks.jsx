// Import React and necessary hooks
import React from 'react';
import { Link } from 'react-router-dom';
import './Bookmarks.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

const BookmarksPage = () => {
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
                                            <th>Time</th>
                                            <th></th>
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
                                            <td>Data @ Time</td>
                                            <td className="checkbox-cell">
                                                <input className="checkbox bookmark" type="checkbox" value="" id="flexCheckDefault" />
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

export default BookmarksPage;

