// src/context/AppContext.js
import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [pageTitle, setPageTitle] = useState('Health Monitoring'); // Default title

    return (
        <AppContext.Provider value={{ pageTitle, setPageTitle }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
