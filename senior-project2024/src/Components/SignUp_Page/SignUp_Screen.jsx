import { Link } from 'react-router-dom';
import "./SignUp_Page.css";
import React, { useState } from "react";
import axios from 'axios'; 


const SignUpScreen = () => {
  const [role, setRole] = useState(""); // State to track selected role
  const [id, setId] = useState(""); // State for SID/EID input
  const [errorMessage, setErrorMessage] = useState(""); // State for validation errors

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setId(""); // Clear SID/EID input when role changes
    setErrorMessage(""); // Clear error message
  };

  const handleIdChange = (e) => {
    const value = e.target.value;
    // Ensure only numeric input
    if (!/^\d*$/.test(value)) return;
    setId(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (errorMessage) {
      alert("Please fix the errors before submitting.");
      return;
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h1>Get Started Now</h1>
        <form onSubmit={handleSubmit}>
          {/* User Name */}
          <label htmlFor="name">Name</label>
          <input type="text" id="name" placeholder="Enter first and last name" required />
          {/* User Email */}
          <label htmlFor="email">Email address (.edu only)</label>
          <input type="email" id="email" placeholder="Enter your email" required />
          {/* User University */}
          <label htmlFor="university">Choose University</label>
          <select id="university" required>
            <option value="">Select University...</option>
            <option value="University of Texas Rio Grande Valley (Edinburg)">
              University of Texas Rio Grande Valley (Edinburg)
            </option>
            <option value="University of Texas Rio Grande Valley (Brownsville)">
              University of Texas Rio Grande Valley (Brownsville)
            </option>
          </select>
          {/* User Role */}
          <label htmlFor="role">You are</label>
          <select id="role" value={role} onChange={handleRoleChange} required>
            <option value="">Select role...</option>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>

          {/* Conditional rendering for SID/EID */}
          {role && (
            <>
              <label htmlFor="sid">{role === "student" ? "SID" : "EID"}</label>
              <input
                type="text"
                id="sid"
                placeholder={`Enter your ${role === "student" ? "student ID" : "employee ID"}`}
                value={id}
                onChange={handleIdChange}
                className={errorMessage ? "error-input" : ""}
                required
              />
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </>
          )}

          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <p className="have-account">
          Have an account? <Link to="/login">Sign In</Link>
         </p>
      </div>
      <div className="col-md-6 signup-image"></div>
    </div>
  );
};

export default SignUpScreen;
