import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Components/Sidebar.jsx';
import Header from './Components/Header.jsx';
// import Add_Screen from './Components/Add_Page/Add_Screen';
// import Sidebar from './Components/Sidebar.jsx'
import Calendar_Screen from './Components/Calendar_Page/Calendar_Screen';
import HomePage from './Components/Home_Page/Home_Page.jsx';
import Login_Screen from './Components/Login_Page/Login_Screen';
import LoginAuth_Screen from './Components/LoginAuth_Page/LoginAuth_Screen';
import SignUp_Screen from './Components/SignUp_Page/SignUp_Screen';
import All_Page from './Components/All_Page/All_Page.jsx';
import RequestsPage from './Components/MyEquip_Page/Requests_Page.jsx';
import InventoryPage from './Components/MyEquip_Page/Inventory_Page.jsx'
import AddPage from './Components/Add_Page/Add_Screen.jsx'
import HistoryPage from './Components/Home_Page/History.jsx'
import BookmarksPage from './Components/Home_Page/Bookmarks.jsx'

import './App.css';

// Create a component that contains the Sidebar logic
const AppContent = () => {
  // Get the current location
  const location = useLocation();

  return (
    <>
      {/* Routes without the Sidebar */}
      <Routes>
        <Route path="/signup" element={<SignUp_Screen />} />
        <Route path="/loginauth" element={<LoginAuth_Screen />} />
        <Route path="/login" element={<Login_Screen />} />
        <Route path="/calendar" element={<Calendar_Screen />} />
      </Routes>

      {/* If the current route is not "/calendar", render the Sidebar */}
      {location.pathname !== "/calendar" && (
        <div className="d-flex">
          <Sidebar /> {/* Sidebar will be hidden on /calendar */}
          <div className="main-content">
            <Routes>
              <Route path="/home" element={<><Header /><HomePage /></>} />
              <Route path="/all" element={<><Header /><All_Page /></>}  />
              <Route path="/add" element={<><Header /><AddPage /></>} />
              <Route path="/requests" element={<><Header /><RequestsPage /></>} />
              <Route path="/inventory" element={<><Header /><InventoryPage /></>} />
              <Route path="/history" element={<><Header /><HistoryPage /></>} />
              <Route path="/bookmarks" element={<><Header /><BookmarksPage /></>} />
              <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
          </div>
        </div>
      )}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
