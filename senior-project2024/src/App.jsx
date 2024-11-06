import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
// import Add_Screen from './Components/Add_Page/Add_Screen';
import Calendar_Screen from './Components/Calendar_Page/Calendar_Screen';
import HomePage from './Components/Home_Page/Home_Page.jsx';
import Login_Screen from './Components/Login_Page/Login_Screen';
import LoginAuth_Screen from './Components/LoginAuth_Page/LoginAuth_Screen';
import SignUp_Screen from './Components/SignUp_Page/SignUp_Screen';
import All_Page from './Components/All_Page/All_Page.jsx';
import RequestsPage from './Components/MyEquip_Page/Requests_Page.jsx';
import InventoryPage from './Components/MyEquip_Page/Inventory_Page.jsx'

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
               <Routes>
               <Route path="/signup" element={<SignUp_Screen/>} />
               <Route path="/home" element={<><HomePage /></>} />
               <Route path="/loginauth" element={<><LoginAuth_Screen /></>} />
               <Route path="/login" element={<><Login_Screen /></>} />
               <Route path="/all" element={<><All_Page /></>} />
               <Route path="/requests" element={<><RequestsPage /></>} />
               <Route path="/inventory" element={<><InventoryPage /></>} />
               <Route path="/calendar" element={<Calendar_Screen />} />
                {/* <Route path="/logout" element={<LogOut />} /> */}
                {/* <Route path="/forgot" element={<ForgotPasswordPage />} /> */}
{/*               
              
              
                {/* <Route path='/add' element={<Add_Screen />} /> */}
                {/* <Route path='/account' element={<Account />} /> */}
                {/* <Route path="*" element={<h1>Not Found</h1>} /> */}
              </Routes>
              {/* <div className='footerSpace'></div> */}
            {/* <Footer  className="footer"/> */}
          </div>
        </Router>
  );
}

export default App;
