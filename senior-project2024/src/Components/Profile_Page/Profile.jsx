import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useUser } from '../../UserContext'; // Import UserContext
import axios from 'axios';

const Profile = () => {
    const { user, setUser } = useUser(); 

    // Local state for profile fields
    const [profileImage, setProfileImage] = useState(null);
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');

    // Initialize profile fields from user context
    useEffect(() => {
        if (user && user.user_id) {
            console.log('Initializing Profile with Context Data:', user);
            setName(user.user_name || ''); // Map user_name to name field
            setPhone(user.phone || user.phone_number || ''); // Handle phone_number mapping
        }
    }, [user]);

    // Handle file selection for profile image
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl); // Set the preview image
        }
    };

    // Trigger file input click for profile image upload
    const handleUploadClick = () => {
        document.getElementById('fileInput').click();
    };

    // Restrict phone input to numbers only
    const handlePhoneChange = (event) => {
        const value = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        setPhone(value);
    };

    // Handle form submission to update user profile
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.put(`http://localhost:5001/user`, {
                user_email: user.user_email, // Use user_email from context
                user_name: name, // Send updated name
                phone_number: phone, // Send updated phone number
            });

            if (response.data.message) {
                alert('Profile updated successfully!');

                // Re-fetch updated user data to ensure consistency
                const updatedUserResponse = await axios.post('http://localhost:5001/user', { email: user.user_email });

                if (updatedUserResponse.data.user) {
                    setUser(updatedUserResponse.data.user); // Update context with backend response
                }
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
                    value={name} // Dynamically linked to state
                    onChange={(e) => setName(e.target.value)} // Allow editing
                    placeholder="Name"
                    required
                />

                {/* Read-Only Role Field */}
                <label htmlFor="role">Role</label>
                <input
                    type="text"
                    id="role"
                    value={user.role_id === 1 ? 'Faculty' : 'Student'} 
                    readOnly
                />

                {/* Read-Only Email Field */}
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={user.user_email || ''}
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
