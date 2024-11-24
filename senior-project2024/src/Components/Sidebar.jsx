// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { useUser } from '../UserContext'; // Import the UserContext hook
// import './Sidebar.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import "bootstrap-icons/font/bootstrap-icons.css";
// import logo from '../static/logo/bookem-high-resolution-logo-transparent.png'; // Adjust the path to your actual file location


// const Sidebar = () => {
//     const { user } = useUser();

//     return (
//         <div className="sidebar flex-shrink-0">
//             {/* Logo Section */}
//             <div className="sidebar-logo">
//                 <img src={logo} alt="Book'Em Logo" className="logo" />
//             </div>

//             <ul className="nav">
//                 {/* Common Links */}
//                 <li className="nav-item nav-icon">
//                     <NavLink to="/home" className="nav-link text-white" activeClassName="active">
//                         <i className="bi bi-house-door"></i>
//                         <span> Home</span>
//                     </NavLink>
//                 </li>
//                 <li className="nav-item nav-icon">
//                     <NavLink to="/all" className="nav-link text-white" activeClassName="active">
//                         <i className="bi bi-grid"></i>
//                         <span> All</span>
//                     </NavLink>
//                 </li>
                
//                 {/* Links for Role ID = 1 */}
//                 {user.role_id === 1 && (
//                     <>
//                         <li className="nav-item nav-icon">
//                             <NavLink to="/add" className="nav-link text-white" activeClassName="active">
//                                 <i className="bi bi-plus-circle"></i>
//                                 <span> Add</span>
//                             </NavLink>
//                         </li>
//                         <li className="nav-item nav-icon">
//                             <NavLink to="/requests" className="nav-link text-white" activeClassName="active">
//                                 <i className="bi bi-box"></i>
//                                 <span> My Equipment</span>
//                             </NavLink>
//                         </li>
//                     </>
//                 )}
//             </ul>
//         </div>
//     );
// };

// export default Sidebar;


import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../UserContext'; // Import the UserContext hook
import './Sidebar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import logo from '../static/logo/bookem-high-resolution-logo-transparent.png'; // Adjust the path to your actual file location

const Sidebar = () => {
    const { user } = useUser();

    return (
        <div className="sidebar flex-shrink-0">
            {/* Logo Section */}
            <div className="sidebar-logo">
                <img src={logo} alt="Book'Em Logo" className="logo" />
            </div>
            
            {/* Navigation Links */}
            <ul className="nav">
                {/* Common Links */}
                <li className="nav-item nav-icon">
                    <NavLink to="/home" className="nav-link" activeClassName="active">
                        <i className="bi bi-house-door"></i>
                        <span> Home</span>
                    </NavLink>
                </li>
                <li className="nav-item nav-icon">
                    <NavLink to="/all" className="nav-link" activeClassName="active">
                        <i className="bi bi-grid"></i>
                        <span> All</span>
                    </NavLink>
                </li>
                
                {/* Links for Role ID = 1 */}
                {user.role_id === 1 && (
                    <>
                        <li className="nav-item nav-icon">
                            <NavLink to="/add" className="nav-link" activeClassName="active">
                                <i className="bi bi-plus-circle"></i>
                                <span> Add</span>
                            </NavLink>
                        </li>
                        <li className="nav-item nav-icon">
                            <NavLink to="/requests" className="nav-link" activeClassName="active">
                                <i className="bi bi-box"></i>
                                <span> My Equipment</span>
                            </NavLink>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
