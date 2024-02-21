import React, { useState, useCallback } from 'react';

const AuthContext = React.createContext<{ token: string | null, username: string | null, isLoggedIn: boolean, login: (token: string, username: string) => void, logout: () => void }>({
    token: '',
    username: '',
    isLoggedIn: false,
    login: (token: string, username: string) => { },
    logout: () => { },
});

export const AuthContextProvider = (props: any) => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('user');

    const [token, setToken] = useState<string | null>(storedToken);
    const [username, setUsername] = useState<string | null>(storedUsername);

    const userIsLoggedIn = !!token && !!username;

    const logoutHandler = useCallback(() => {
        setToken(null);
        setUsername(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }, []);

    const loginHandler = (token: string, username: string) => {
        setToken(token);
        setUsername(username);
        localStorage.setItem('token', token);
        localStorage.setItem('user', username);
    };

    const contextValue = {
        token: token,
        username: username,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
    };

    return (
        <AuthContext.Provider value={contextValue} >
            {props.children}
        </ AuthContext.Provider>
    );
};

export default AuthContext;