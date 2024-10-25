import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (username, password) => {
        const response = await axios.post('/api/auth/login', { username, password });
        setUser(response.data);
    };

    const signup = async (username, password, email) => {
        const response = await axios.post('/api/auth', { username, password, email });
        setUser(response.data);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
