import React, { createContext, useContext, useState } from 'react';

// Create the User Context
const UserContext = createContext();

// UserProvider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    campus_id: null,
    school_id: null,
    role_id: null,
    phone: null,
  }); // Initialize user state with default values

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook to Use the UserContext
export const useUser = () => useContext(UserContext);
