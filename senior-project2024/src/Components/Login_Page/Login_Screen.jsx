import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css'
import './Login_Screen.css'; 

const LoginPage = () => {
    return (
        <div className="container-fluid h-100">
            <div className="row h-100">
                {/* Left side - Login Section */}
                <div className="col-md-6 login-section">
                    <div className="login-box">
                        <h1 className="text-center">Welcome Back!</h1>
                        <p>Enter your Credentials to access  your account</p>
                        <br />
                        <form>
                            <div className="form-group login-button">
                                <label htmlFor="email">Email address (.edu only)</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="Enter your email"
                                    required
                                    />
                            </div>
                            <br /><br />
                            <button type="submit" className="btn btn-primary btn-block login-button">Login</button>
                            <div className="row p-2">
                                <div className="text-center">
                                    <p>Don't have an account? <a href="#" className="nav-link d-inline p-0">Sign Up</a></p>
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