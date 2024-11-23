import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the User Context
const UserContext = createContext();

// Default user structure
const defaultUser = {
  user_id: null,
  name: '',
  email: '',
  campus_id: null,
  school_id: null,
  role_id: null,
  phone: null,
};

// UserProvider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Retrieve user data from sessionStorage or initialize with default values
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : defaultUser;
  });

  useEffect(() => {
    // Save user data to sessionStorage whenever it changes
    if (user && user.user_id !== null) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user'); // Clear session storage if user is reset
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook to Use the UserContext
export const useUser = () => useContext(UserContext);
