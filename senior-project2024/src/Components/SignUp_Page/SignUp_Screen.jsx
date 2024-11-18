import { Link } from 'react-router-dom';
import "./SignUp_Page.css";
import React, { useState } from "react";
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';


const SignUpScreen = () => {
  const { setUser } = useUser(); // Access setUser from context
  const navigate = useNavigate();
  
  
  const [role, setRole] = useState(""); // State to track selected role
  const [id, setId] = useState(""); // State for SID/EID input
  const [errorMessage, setErrorMessage] = useState(""); // State for validation errors
  const [campusId, setCampusId] = useState(""); // State to track campus ID
  const [roleId, setRoleId] = useState(""); // State to track role ID


  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);

    // Map role to role_id
    const roleMap = {
        student: 0,
        faculty: 1,
    };

    if (roleMap.hasOwnProperty(selectedRole)) {
        setRoleId(roleMap[selectedRole]); // Set role_id based on selection
    } else {
        setRoleId(""); // Reset role_id if no valid role is selected
    }

    setId(""); // Clear SID/EID input when role changes
    setErrorMessage(""); // Clear error message
};

  const handleIdChange = (e) => {
    const value = e.target.value;
    // Ensure only numeric input
    if (!/^\d*$/.test(value)) return;
    setId(value);
  };

  const handleUniversityChange = (e) => {
    const university = e.target.value;

    // Map university to campus_id
    const campusMap = {
        "University of Texas Rio Grande Valley (Edinburg)": 1,
        "University of Texas Rio Grande Valley (Brownsville)": 2,
    };

    setCampusId(campusMap[university] || ""); // Set campus_id based on selection
};

// Communicates with backend (server.js file)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value

    // Check if email ends with .edu
    if (!email.endsWith(".edu")) {
      alert("Please use an email address that ends with .edu.");
      return;
    }

    if (!campusId) {
      alert("Please select a valid university.");
      return;
    }

    if (!id) {
      alert("Please enter your SID/EID.");
      return;
    }
    
    if (roleId === "") {
      alert("Please select a valid role.");
      return;
    }

    try {
        const response = await axios.post("http://localhost:5001/add-user", {
            name: name, // Send the user's name
            email: email, //Send the user's email
            campus_id: campusId, // Send campus_id
            school_id: id, // Send SID/EID as school_id
            role_id: roleId, // Send role_id
        });

        if (response.data.message) {
          alert(response.data.message); // Success message
  
          // Save user data in React Context
          setUser({
            name: name,
            email: email,
            campus_id: campusId,
            school_id: id,
            role_id: roleId,
          });
  
          // Navigate to the home page
          navigate('/home');
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
            alert(error.response.data.error); // Display duplicate user error
        } else {
            console.error("Error adding user:", error);
            alert("Failed to add user. Please try again.");
        }
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
          <select id="university" onChange={handleUniversityChange} required>
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
          {/* Submit Button */}
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        {/* Link to login page */}
        <p className="have-account">
          Have an account? <Link to="/login">Sign In</Link>
         </p>
      </div>
      {/* Image to right */}
      <div className="col-md-6 signup-image"></div>
    </div>
  );
};

export default SignUpScreen;
