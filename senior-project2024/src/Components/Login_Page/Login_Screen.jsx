import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Login_Screen.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const LoginPage = () => {
    const [email, setEmail] = useState(''); 
    const [error, setError] = useState(''); 
    const navigate = useNavigate(''); 

    // Function to handle form submission
    const handleSubmit = (e) => {
        // prevent default form submission 
        e.preventDefault();

        const eduEmailRegex = /^[\w.%+-]+@[A-Za-z0-9.-]+\.(edu)$/;
        if (!eduEmailRegex.test(email)) {
            setError('Please enter a valid .edu email address');
            return;
        }

        setError('');
        navigate('/loginauth'); 

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
                            <div className="form-group login-button">
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
                            <br/>
                            {error && <p className="text-danger">{error}</p>}
                            <br />
                            <button type="submit" className="btn btn-primary btn-block login-button">Login</button>
                            <div className="row p-2">
                                <div className="text-center">
                                    <p>Don't have an account? <Link to="/signup" className="nav-link d-inline p-0">Sign Up</Link></p>
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