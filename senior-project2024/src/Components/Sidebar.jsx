import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../UserContext'; // Import the UserContext hook
import './Sidebar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

const Sidebar = () => {
    const { user } = useUser();

    return (
        <div className="sidebar flex-shrink-0">
            <ul className="nav">
                {/* Common Links */}
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
                
                {/* Links for Role ID = 1 */}
                {user.role_id === 1 && (
                    <>
                        <li className="nav-item nav-icon">
                            <NavLink to="/add" className="nav-link text-white" activeClassName="active">
                                <i className="bi bi-plus-circle"></i>
                                <span> Add</span>
                            </NavLink>
                        </li>
                        <li className="nav-item nav-icon">
                            <NavLink to="/requests" className="nav-link text-white" activeClassName="active">
                                <i className="bi bi-box"></i>
                                <span> My Equipment</span>
                            </NavLink>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
