import React from 'react';
import { Link } from 'react-router-dom';
import './SignUp_Page.css'; // Assuming you have a CSS file for custom styling

const SignUp_Screen = () => {
  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        {/* Left side of the screen for login */}
        <div className="col-md-6 login-section">
          <div className="login-box">
            <h1 className="text-center">Get Started Now!</h1>
            <br />
            <div className="form-group login-button">
              <label htmlFor="email">Email address (.edu only)</label>
              <input type="email" className="form-control" id="email" placeholder="Enter your email" />
            </div>
            <br /><br />
            <div className="form-group login-button">
              <label htmlFor="university">Choose University</label>
              <select className="form-select">
                <option value="option0">None</option>
                <option value="option1">University of Texas Rio Grande Valley - Edinburg</option>
                <option value="option2">University of Texas Rio Grande Valley - Brownsville</option>
              </select>
            </div>
            <br /><br />
            <button type="submit" className="btn btn-primary w-100 login-button">Sign Up</button>
            <div className="row p-2">
              <div className="text-center">
                <p>Have an account? <Link to="/login" className="nav-link d-inline p-0">Sign In</Link></p>
              </div>
            </div>
          </div>
        </div>
        {/* Right side of login screen */}
        <div className="col-md-6 welcome-image"></div>
      </div>
    </div>
  );
};

export default SignUp_Screen;
