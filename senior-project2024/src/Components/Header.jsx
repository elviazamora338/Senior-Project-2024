import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import banner from '../static/uni_banner/utrgv_banner.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

const Header = () => {
    // State to toggle the dropdown visibility
    const [menuOpen, setMenuOpen] = useState(false);

    // Ref to the dropdown menu to check for outside clicks
    const menuRef = useRef(null);

    // Menu items with icons
    const menuItems = [
        { name: 'Profile', icon: 'bi-person' },
        { name: 'Settings', icon: 'bi-gear' },
        { name: 'Log out', icon: 'bi-box-arrow-right' }
    ];

    // Function to toggle the dropdown visibility
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // Close menu if the user clicks outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false); // Close menu
            }
        };

        // Adding event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup event listener on unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            {/* Header Section */}
            <div className="card card-custom mb-0">
                <div className="card-body table-header">
                    <div className="row">
                        <div className="col-sm-8"></div>
                        <div className="col-sm-4">
                            <div className="d-flex justify-content-end text-over text-white">
                                <i>Change University</i>
                                <i className="text-black bi bi-paperclip mx-2"></i>
                                <i className="text-black bi bi-calendar4-event mx-2"></i>

                                {/* Three Dots Button to Trigger Menu */}
                                <i 
                                    className="text-black bi bi-three-dots-vertical mx-2 cursor-pointer" 
                                    onClick={toggleMenu}
                                ></i>

                                {/* Dropdown Menu with animation and ref */}
                                <div
                                    ref={menuRef}
                                    className={`dropdown-menu ${menuOpen ? 'show' : ''}`}
                                >
                                    <ul>
                                        {menuItems.map((item) => (
                                            <li key={item.name} className="menu-item text-white">
                                                <i className={`bi ${item.icon} mr-2 text-white`}></i> {/* Icon */}
                                                {item.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* University Banner */}
            <div className="container container-banner">
                <div className="img-container">
                    <img src={banner} alt="UTRGV logo banner" />
                    <div className="text-overlay">
                        <h1>Equipment Scheduler</h1>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
