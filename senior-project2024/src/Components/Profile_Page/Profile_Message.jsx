import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "./Profile_Message.css";

const Profile_Message = ({ show, onHide, personInChargeName }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (personInChargeName && show) {
      setLoading(true);
      setError(null);
      setProfileData(null);

      fetch("http://localhost:5001/user-by-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: personInChargeName }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch profile data");
          }
          return response.json();
        })
        .then((data) => {
          setProfileData(data.user);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching profile data:", err.message);
          setError("Failed to load profile data.");
          setLoading(false);
        });
    }
  }, [personInChargeName, show]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton />
      <Modal.Body>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <div className="profile-container">
            <div
              className="avatar"
              style={{
                backgroundImage: `url(${profileData.profileImage || 'placeholder.jpg'})`,
              }}
            ></div>
            <form>
              <label>Name</label>
              <input
                type="text"
                value={profileData.user_name || "Name"}
                readOnly
              />

              <label>Role</label>
              <input
                type="text"
                value={profileData.role_id === 1 ? "Faculty" : "Student"}
                readOnly
              />

              <label>Email</label>
              <input
                type="text"
                value={profileData.user_email || "xxx@school.edu"}
                readOnly
              />

              <label>Phone Number</label>
              <input
                type="text"
                value={profileData.phone_number || "+93123135"}
                readOnly
              />
            </form>
            <button className="message-button">Message</button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default Profile_Message;

