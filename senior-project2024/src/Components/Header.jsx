import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import banner from '../static/uni_banner/utrgv_banner.jpg';
import { Modal, Button } from 'react-bootstrap'; // Import Modal and Button
import Profile from '../Components/Profile_Page/Profile.jsx'; // Import the Profile component
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useUser } from '../UserContext'; // Import UserContext

const Header = () => {
    const { user, setUser } = useUser();
    const [menuOpen, setMenuOpen] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const menuRef = useRef(null);

    // Restore user data from sessionStorage on mount
    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser && !user) {
            setUser(JSON.parse(storedUser));
        }
    }, [setUser, user]);

    const handleProfileShow = () => setShowProfileModal(true);
    const handleProfileClose = () => setShowProfileModal(false);

    const handleLogout = () => {
        try {
            sessionStorage.clear();
            setUser(null); // Clear the UserContext
            window.location.href = '/login';
            console.log('Logged Out');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const menuItems = [
        { name: 'Profile', icon: 'bi-person', action: handleProfileShow },
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
            <div className="card card-custom mb-0">
                <div className="card-body table-header">
                    <div className="row">
                        <div className="col-sm-8"></div>
                        <div className="col-sm-4">
                            <div className="d-flex justify-content-end text-over text-white">
                                <i>Change University</i>
                                <i className="text-black bi bi-paperclip mx-2"></i>
                                <i className="text-black bi bi-calendar4-event mx-2"></i>
                                <i
                                    className="text-black bi bi-three-dots-vertical mx-2 cursor-pointer"
                                    onClick={toggleMenu}
                                ></i>
                                <div ref={menuRef} className={`dropdown-menu ${menuOpen ? 'show' : ''}`}>
                                    <ul>
                                        {menuItems.map((item) => (
                                            <li
                                                key={item.name}
                                                className="menu-item text-white"
                                                onClick={item.action || (() => {})}
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
            <div className="container container-banner">
                <div className="img-container">
                    <img src={banner} alt="UTRGV logo banner" />
                    <div className="text-overlay">
                        <h1>Equipment Scheduler</h1>
                    </div>
                </div>
            </div>
            <Modal show={showProfileModal} onHide={handleProfileClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Profile />
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
