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
import { UserProvider } from './UserContext';
import './App.css';

const AppContent = () => {
  const location = useLocation();

  // Determine if routes require Sidebar and Header
  const showSidebar = !["/calendar", "/loginauth", "/login", "/signup"].includes(location.pathname);
  return (
    <>
      {showSidebar ? (
        <div className="d-flex">
          <Sidebar />
          <div className="main-content">
            <Header />
            <Routes>
              <Route path="/home" element={<HomePage />} />
              <Route path="/all" element={<All_Page />} />
              <Route path="/add" element={<AddPage />} />
              <Route path="/requests" element={<RequestsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
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