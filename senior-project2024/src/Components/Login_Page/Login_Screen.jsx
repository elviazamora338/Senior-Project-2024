import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Login_Screen.css'; 
import axios from 'axios'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 


const LoginPage = () => {
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

                navigate('/loginauth', { state: { email } });
            }
        } catch (error) {
            setError('Failed to send OTP. Please try again'); 
        }

    }; 

    return (
        <div className="container-fluid h-100">
            <div className="row h-100">
                {/* Left side - Login Section */}
                <div className="col-md-6 login-section">
                    <div className="login-box">
                        <h1 className="text-center">Welcome Back!</h1>
                        <p>Enter your Credentials to access  your account</p>
                        <br />
                        <form onSubmit={handleSubmit}>
                            <div className="form-group login">
                                <label htmlFor="email">Email address (.edu only)</label>
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
                            
                            {error && <p className="text-danger">{error}</p>}
                            {success && <p className="text-success">{success}</p>}
                            
                            <button type="submit" className="btn btn-primary btn-block login-button">Login</button>
                            <div className="row p-2">
                                <div className="text-center">
                                    <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                {/* Right side - Welcome Image*/}
                <div className="col-md-6 welcome-image"></div>
            </div>
        </div>
    );
}; 

export default LoginPage; 