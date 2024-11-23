import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "./Profile_Message.css";
import { useUser } from "../../UserContext";

const Profile_Message = ({ show, onHide, personInChargeName, equipmentName }) => {
  const { user } = useUser(); // Access the current user's data
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(""); // Store the message input

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

  const handleSendMessage = async () => {
    const payload = {
      sender_email: user.email,
      recipient_email: profileData.user_email,
      message_content: message,
      equipment_name: equipmentName,
    };

    console.log('Payload:', payload); // Debugging log

    try {
      const response = await fetch("http://localhost:5001/save-and-send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Message sent successfully!");
        setMessage(""); // Clear the message input
        onHide(); // Close the modal
      } else {
        console.error("Error saving or sending message:", result.error);
        alert("Failed to send the message. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Body>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <div className="message-form">
            <div className="header">
              <h2 className="profile-name center-text">Inquiry for: {equipmentName}</h2>
            </div>
            <form>
              <label>Sender Email</label>
              <input type="text" value={user.email || ""} readOnly className="read-only-input" />

              <label>Recipient Email</label>
              <input type="text" value={profileData.user_email || ""} readOnly className="read-only-input" />

              <label>Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="4"
              />

              <button type="button" className="send-button" onClick={handleSendMessage}>
                Send
              </button>
            </form>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default Profile_Message;
