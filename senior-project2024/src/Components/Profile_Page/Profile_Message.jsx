// import React, { useState, useEffect } from "react";
// import { Modal } from "react-bootstrap";
// import "./Profile_Message.css";

// const Profile_Message = ({ show, onHide, personInChargeName }) => {
//   const [profileData, setProfileData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (personInChargeName && show) {
//       setLoading(true);
//       setError(null);
//       setProfileData(null);

//       fetch("http://localhost:5001/user-by-name", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name: personInChargeName }),
//       })
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error("Failed to fetch profile data");
//           }
//           return response.json();
//         })
//         .then((data) => {
//           setProfileData(data.user);
//           setLoading(false);
//         })
//         .catch((err) => {
//           console.error("Error fetching profile data:", err.message);
//           setError("Failed to load profile data.");
//           setLoading(false);
//         });
//     }
//   }, [personInChargeName, show]);

//   return (
//     <Modal show={show} onHide={onHide} centered>
//       <Modal.Header closeButton />
//       <Modal.Body>
//         {loading ? (
//           <p>Loading...</p>
//         ) : error ? (
//           <p className="text-danger">{error}</p>
//         ) : (
//           <div className="profile-container">
//             <div
//               className="avatar"
//               style={{
//                 backgroundImage: `url(${profileData.profileImage || 'placeholder.jpg'})`,
//               }}
//             ></div>
//             <form>
//               <label>Name</label>
//               <input
//                 type="text"
//                 value={profileData.user_name || "Name"}
//                 readOnly
//               />

//               <label>Role</label>
//               <input
//                 type="text"
//                 value={profileData.role_id === 1 ? "Faculty" : "Student"}
//                 readOnly
//               />

//               <label>Email</label>
//               <input
//                 type="text"
//                 value={profileData.user_email || "xxx@school.edu"}
//                 readOnly
//               />

//               <label>Phone Number</label>
//               <input
//                 type="text"
//                 value={profileData.phone_number || "+93123135"}
//                 readOnly
//               />
//             </form>
//             <button className="message-button">Message</button>
//           </div>
//         )}
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default Profile_Message;


import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "./Profile_Message.css";
import { useUser } from '../../UserContext'; 

const Profile_Message = ({ show, onHide, personInChargeName }) => {
  const { user } = useUser(); // Access the current user's data
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMessageForm, setShowMessageForm] = useState(false); // Toggle between profile and message views
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

  const handleBackClick = () => {
    setShowMessageForm(false); // Return to the profile view
  };

  const handleSendMessage = () => {
    // Implement your message sending logic here (e.g., API call)
    console.log("Message sent:", message);
    setMessage("");
    setShowMessageForm(false); // Optionally return to the profile view after sending
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Body>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : showMessageForm ? (
          <div className="message-form">
            <div className="header">
              <button className="back-button" onClick={handleBackClick}>
                ←
              </button>
              <h2 className="profile-name">{profileData.user_name}</h2>
            </div>
            <form>
              <label>Sender Email</label>
              <input
                type="text"
                value={user.email || ""}
                readOnly
                className="read-only-input"
              />

              <label>Recipient Email</label>
              <input
                type="text"
                value={profileData.user_email || ""}
                readOnly
                className="read-only-input"
              />

              <label>Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
              />

              <button
                type="button"
                className="send-button"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </form>
          </div>
        ) : (
          <div className="profile-container">
            <div
              className="avatar"
              style={{
                backgroundImage: `url(${
                  profileData.profileImage || "placeholder.jpg"
                })`,
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
            <button
              className="message-button"
              onClick={() => setShowMessageForm(true)}
            >
              Message
            </button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default Profile_Message;