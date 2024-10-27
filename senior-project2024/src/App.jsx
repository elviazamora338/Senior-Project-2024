import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Add_Screen from './Components/Add_Page/Add_Screen';
import All_Screen from './Components/Add_Page/Add_Screen';
import Calendar_Screen from './Components/Calendar_Page/Calendar_Screen';
import Home_Page from './Components/Home_Page/Home_Page';
import Login_Screen from './Components/Login_Page/Login_Screen';
import LoginAuth_Screen from './Components/LoginAuth_Page/LoginAuth_Screen';
import SignUp_Screen from './Components/SignUp_Page/SignUp_Screen';


import './App.css';

function App() {

  return (
    <Router>
      <div className='app'>
               <Routes>
               <Route path="/signup" element={<SignUp_Screen/>} />
               <Route path="/home" element={<Home_Page />} />
                <Route path="/login" element={<Login_Screen />} />
                {/* <Route path="/logout" element={<LogOut />} /> */}
                {/* <Route path="/forgot" element={<ForgotPasswordPage />} /> */}
              
              
                <Route path="/all" element={<All_Screen />} />
                <Route path="/calendar" element={<Calendar_Screen />} />
                <Route path="/loginauth" element={<LoginAuth_Screen />} />
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
