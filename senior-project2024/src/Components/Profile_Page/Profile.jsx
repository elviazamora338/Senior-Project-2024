import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useUser } from '../../UserContext'; // Import UserContext
import axios from 'axios';

const Profile = () => {
    const { user, setUser } = useUser(); // Access user data from context
    const [profileImage, setProfileImage] = useState(null);
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');

    // Fetch user data from context when the component loads
    useEffect(() => {
        if (user) {
            setName(user.name || ''); // Initialize name field from user context
            setPhone(user.phone || ''); // Initialize phone field from user context
        }
    }, [user]);

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


    // Handle form submission to update user data
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.put(`http://localhost:5001/user`, {
                user_email: user.email,
                user_name: name, // Send updated name
                phone_number: phone, // Send updated phone number
            });

            if (response.data.message) {
                alert('Profile updated successfully!');
                // Update context with new data
                setUser({
                    ...user,
                    name: name,
                    phone: phone,
                });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    if (!user) {
        return <div>Loading...</div>; // Display loading state if user data isn't available
    }

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
            <form onSubmit={handleSubmit}>
                {/* Editable Name Field */}
                <label htmlFor="Name">Name</label>
                <input
                    type="text"
                    id="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)} // Allow editing the name
                    placeholder="Name"
                    required
                />

                {/* Read-Only Role Field */}
                <label htmlFor="role">Role</label>
                <input
                    type="text"
                    id="role"
                    value={user.role_id === 1 ? 'Faculty' : 'Student'} // Display role based on role_id
                    readOnly
                />

                {/* Read-Only Email Field */}
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={user.email} // Display email from context
                    readOnly
                />

                {/* Editable Phone Number Field */}
                <label htmlFor="phone">Phone Number</label>
                <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="Enter your phone number"
                    inputMode="numeric" 
                    pattern="\d*" // Restrict input to numbers
                    required
                />

                {/* Submit Button */}
                <button type="submit" className="update-button">Update</button>
            </form>
        </div>
    );
};

export default Profile;
