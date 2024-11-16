import React, { useState } from 'react';
import './Profile.css';

const Profile = () => {
    const [profileImage, setProfileImage] = useState(null);
    const [phone, setPhone] = useState('');

    // Handle file selection
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl); // Set the preview image
        }
    };

    // Trigger file input click
    const handleUploadClick = () => {
        document.getElementById('fileInput').click();
    };

    // Handle phone number input, allowing only numbers
    const handlePhoneChange = (event) => {
        const value = event.target.value.replace(/\D/g, ''); // Remove any non-numeric characters
        setPhone(value);
    };

    return (
        <div className="profile-container">
            <div
                className="avatar"
                onClick={handleUploadClick}
                style={{
                    cursor: 'pointer',
                    backgroundImage: profileImage ? `url(${profileImage})` : 'none',
                    backgroundColor: profileImage ? 'transparent' : '#e0e0e0',
                }}
            >
                <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                />
            </div>
            <form>
                <label htmlFor="Name">Name</label>
                <input type="text" id="Name" placeholder="Name" required />

                <label htmlFor="role">Role</label>
                <input type="text" id="role" value="Student" readOnly />

                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="xxx@school.edu" required />

                <label htmlFor="phone">Phone Number</label>
                <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="+93123135"
                    inputMode="numeric" // Mobile-friendly numeric keypad
                    pattern="\d*" // Restricts to numbers
                    required
                />

                <button type="submit" className="update-button">Update</button>
            </form>
        </div>
    );
};

export default Profile;
