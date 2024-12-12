import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './Components/Sidebar.jsx';
import Header from './Components/Header.jsx';
import HomePage from './Components/Home_Page/Home_Page.jsx';
import Login_Screen from './Components/Login_Page/Login_Screen';
import LoginAuth_Screen from './Components/LoginAuth_Page/LoginAuth_Screen';
import SignUp_Screen from './Components/SignUp_Page/SignUp_Screen';
import All_Page from './Components/All_Page/All_Page.jsx';
import RequestsPage from './Components/MyEquip_Page/Requests_Page.jsx';
import InventoryPage from './Components/MyEquip_Page/Inventory_Page.jsx';
import ReportsPage from './Components/MyEquip_Page/Reports_Page.jsx';
import AddPage from './Components/Add_Page/Add_Screen.jsx';
import HistoryPage from './Components/Home_Page/History.jsx';
import BookmarksPage from './Components/Home_Page/Bookmarks.jsx';
import InventoryUpdate from './Components/MyEquip_Page/Inventory_Update.jsx';
import { UserProvider } from './UserContext.js';
import './App.css';
import { useEffect } from 'react'; // Import useEffect

import { Navigate } from 'react-router-dom'; // Import Navigate for redirection

const AppContent = () => {
  const location = useLocation();

  // Determine if routes require Sidebar and Header
  const showSidebar = !["/calendar", "/loginauth", "/login", "/signup"].includes(location.pathname);
  // Update tab name based on the current route
  useEffect(() => {
    switch (location.pathname) {
      case "/home":
        document.title = "Home - Equipment Scheduler";
        break;
      case "/all":
        document.title = "All Equipment - Equipment Scheduler";
        break;
      case "/add":
        document.title = "Add Equipment - Equipment Scheduler";
        break;
      case "/requests":
        document.title = "Requests - Equipment Scheduler";
        break;
      case "/reports":
        document.title = "Reports - Equipment Scheduler";
        break;
      case "/inventory":
        document.title = "Inventory - Equipment Scheduler";
        break;
      case "/history":
        document.title = "History - Equipment Scheduler";
        break;
      case "/bookmarks":
        document.title = "Bookmarks - Equipment Scheduler";
        break;
      case "/inventory/update/:device_id":
        document.title = "Update Inventory - Equipment Scheduler";
        break;
      case "/signup":
        document.title = "Sign Up - Equipment Scheduler";
        break;
      case "/loginauth":
        document.title = "Authentication - Equipment Scheduler";
        break;
      case "/login":
        document.title = "Login - Equipment Scheduler";
        break;
      default:
        document.title = "Equipment Scheduler";
    }
  }, [location.pathname]); // Run this effect whenever the pathname changes

  return (
    <>
      {showSidebar ? (
        <div className="d-flex">
          <Sidebar />
          <div className="main-content">
            <Header />
            <Routes>
              {/* Redirect root to login */}
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/all" element={<All_Page />} />
              <Route path="/add" element={<AddPage />} />
              <Route path="/requests" element={<RequestsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/inventory/update/:device_id" element={<InventoryUpdate />} />
              <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/signup" element={<SignUp_Screen />} />
          <Route path="/loginauth" element={<LoginAuth_Screen />} />
          <Route path="/login" element={<Login_Screen />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      )}
    </>
  );
};


function App() {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}

export default App;