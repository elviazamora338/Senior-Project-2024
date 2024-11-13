import React, { useState } from "react";
import './LoginAuth_Screen.css'; 
import axios from 'axios'; 
import { useLocation, useNavigate } from "react-router-dom";

const LoginAuth_Screen = () => {
    const [otp, setOtp] = useState(''); 
    const [error, setError] = useState(''); 
    const [success, setSuccess] = useState(''); 
    const navigate = useNavigate(); 
    const location = useLocation(); 
    const email = location.state?.email; 

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5001/verify-otp', { email, otp });

            if (response.data.message === 'OTP verified successfully') {
                setSuccess('OTP verified! You are logged in.');

                setTimeout(() => {
                    navigate('/home');
                }, 1000);
            }
        } catch (error) {
            setError('Invalid OTP or OTP expired');
        }
    }; 

    return (
        <div className="container-fluid h-100">
            <div className="row h-100">
                {/* Left side - Verification code */}
                <div className="col-md-6 login-section">
                    <div className="login-box">
                        <h1 className="text-center">Verify Your Identity</h1>
                    <p>Check your email for a one-time code</p>
                    <br /><br />
                    <form onSubmit={handleSubmit}>
                        <div className="form-group login-auth">
                            <label htmlFor="code">Enter your code</label>
                            <input type="number"
                                    className="form-control"
                                    id="code"
                                    placeholder="Code"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                        </div>
                            <br />
                            {error && <p className="text-danger">{error}</p>}
                            {success && <p className="text-success">{success}</p>}
                        <button type="submit"
                        className="btn btn-primary btn-block login-auth">Continue</button>
                    </form>
                    </div>
                </div>
                {/* Right side of the login screen */}
                <div className="col-md-6 welcome-image"></div>
            </div>
        </div>
    )
}

export default LoginAuth_Screen;