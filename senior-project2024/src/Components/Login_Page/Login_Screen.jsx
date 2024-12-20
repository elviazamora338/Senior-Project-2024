import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Login_Screen.css'; 
import axios from 'axios'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { useUser } from '../../UserContext'; 

const LoginPage = () => {
    const { setUser } = useUser();
    const [email, setEmail] = useState(''); 
    const [error, setError] = useState(''); 
    const [success, setSuccess] = useState(''); 
    const navigate = useNavigate(''); 

    // Function to handle form submission
    const handleSubmit = async (e) => {
        // prevent default form submission 
        e.preventDefault();

        const eduEmailRegex = /^[\w.%+-]+@[A-Za-z0-9.-]+\.(edu)$/;
        if (!eduEmailRegex.test(email)) {
            setError('Please enter a valid .edu email address');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5001/send-otp', { email });
        
            if (response.data.message === 'OTP sent to your email') {
                setError('');
                setSuccess('OTP sent successfully! Check your email.');
                
                // Fetch User Data
                const userResponse = await axios.post('http://localhost:5001/user', { email });
        
                if (userResponse.data.user) {
                    const { user_id, user_name, user_email, role_id, campus_id, school_id, phone_number } = userResponse.data.user;
        
                    setUser({
                        user_id: user_id,
                        name: user_name, 
                        email: user_email, 
                        role_id: role_id,
                        campus_id: campus_id,
                        school_id: school_id,
                        phone: phone_number, 
                    });
        
                    navigate('/loginauth', { state: { email } });
                } else {
                    setError('Failed to fetch user data. Please try again.');
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError('Email not found');
            } else {
                console.error('Login error:', error);
                setError('Failed to send OTP. Please try again.');
            }
        }
    }; 

    return (
        <div className="container-fluid h-100">
            <div className="row h-100">
                {/* Error Banner */}
                {error && (
                    <div className="alert alert-danger text-center w-100" role="alert">
                        <i className="bi bi-exclamation-circle-fill"></i> {error}
                    </div>
                )}
                {success && (
                    <div className="alert alert-success text-center w-100" role="alert">
                        <i className="bi bi-check-circle-fill"></i> {success}
                    </div>
                )}
                {/* Left side - Login Section */}
                <div className="col-md-6 login-section">
                    <div className="login-box">
                        <h1 className="text-center">Welcome Back!</h1>
                        <p>Enter your Credentials to access your account</p>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="email">Email address (.edu only)</label>
                            <div className="form-group login-button">
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <br />
                            <button type="submit" className="btn btn-primary btn-block login-button">Login</button>
                            <div className="row p-2">
                                <div className="text-center">
                                    <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                {/* Right side - Welcome Image */}
                <div className="col-md-6 welcome-image"></div>
            </div>
        </div>
    );
}; 

export default LoginPage;
