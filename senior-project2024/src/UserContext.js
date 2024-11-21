import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the User Context
const UserContext = createContext();

// UserProvider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Retrieve user data from sessionStorage or initialize with default values
    const storedUser = sessionStorage.getItem('user');
    console.log(storedUser);
    return storedUser ? JSON.parse(storedUser) : {
      user_id: null,
      name: '',
      email: '',
      campus_id: null,
      school_id: null,
      role_id: null,
      phone: null,
    };

  });

  useEffect(() => {
    // Save user data to sessionStorage whenever it changes
    sessionStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook to Use the UserContext
export const useUser = () => useContext(UserContext);
