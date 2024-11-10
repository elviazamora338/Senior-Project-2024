// Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

const Sidebar = () => {
    return (
        <div className="sidebar flex-shrink-0 p-3">
            <ul className="nav">
                <li className="nav-item nav-icon">
                    <Link to="/home" className="nav-link text-white">
                        <i className="bi bi-house-door"></i>
                        <span> Home</span>
                    </Link>
                </li>
                <li className="nav-item nav-icon">
                    <Link to="/all" className="nav-link text-white">
                        <i className="bi bi-grid"></i>
                        <span> All</span>
                    </Link>
                </li>
                <li className="nav-item nav-icon">
                    <Link to="/add" className="nav-link text-white">
                        <i className="bi bi-plus-circle"></i>
                        <span> Add</span>
                    </Link>
                </li>
                <li className="nav-item nav-icon">
                    <Link to="/requests" className="nav-link text-white">
                        <i className="bi bi-box"></i>
                        <span> My Equipment</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
