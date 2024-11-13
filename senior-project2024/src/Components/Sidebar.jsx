import React from 'react';
import { NavLink } from 'react-router-dom'; // Use NavLink for active link management
import './Sidebar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

const Sidebar = () => {
    return (
        <div className="sidebar flex-shrink-0">
            <ul className="nav">
                <li className="nav-item nav-icon">
                    <NavLink to="/home" className="nav-link text-white" activeClassName="active">
                        <i className="bi bi-house-door"></i>
                        <span> Home</span>
                    </NavLink>
                </li>
                <li className="nav-item nav-icon">
                    <NavLink to="/all" className="nav-link text-white" activeClassName="active">
                        <i className="bi bi-grid"></i>
                        <span> All</span>
                    </NavLink>
                </li>
                <li className="nav-item nav-icon">
                    <NavLink to="/add" className="nav-link text-white" activeClassName="active">
                        <i className="bi bi-plus-circle"></i>
                        <span> Add</span>
                    </NavLink>
                </li>
                <li className="nav-item nav-icon">
                    <NavLink to="/requests" className="nav-link text-white">
                        <i className="bi bi-box" activeClassName="active"></i>
                        <span> My Equipment</span>
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
