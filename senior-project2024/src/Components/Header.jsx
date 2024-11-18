import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import banner from '../static/uni_banner/utrgv_banner.jpg';
import { Modal, Button } from 'react-bootstrap'; // Import Modal and Button
import Profile from '../Components/Profile_Page/Profile.jsx'; // Import the Profile component
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false); // State to control Profile modal visibility
    const menuRef = useRef(null);

    // Open and close modal handlers
    const handleProfileShow = () => setShowProfileModal(true);
    const handleProfileClose = () => setShowProfileModal(false);

    const handleLogout = () => {
        try {
            sessionStorage.clear();
            // i did this instead of in the server but i'm open to suggestions!
            window.location.href = '/login';
            console.log('Logged Out');
        } catch (error) {
            console.error('Error during logout:', error);
        }

    }
    // Menu items with icons and actions
    const menuItems = [
        { name: 'Profile', icon: 'bi-person', action: handleProfileShow }, // Trigger modal for Profile
        { name: 'Settings', icon: 'bi-gear' },
        { name: 'Log out', icon: 'bi-box-arrow-right', action: handleLogout }
    ];

    const toggleMenu = () => setMenuOpen(!menuOpen);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
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
                                <div ref={menuRef} className={`dropdown-menu ${menuOpen ? 'show' : ''}`}>
                                    <ul>
                                        {menuItems.map((item) => (
                                            <li
                                                key={item.name}
                                                className="menu-item text-white"
                                                onClick={item.action || (() => {})} // Call action if defined
                                            >
                                                <i className={`bi ${item.icon} mr-2 text-white`}></i>
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

            {/* Profile Modal */}
            <Modal show={showProfileModal} onHide={handleProfileClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Profile /> {/* Render Profile component in the modal */}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleProfileClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Header;
