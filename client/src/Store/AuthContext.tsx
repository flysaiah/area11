import React, { useState, useCallback } from 'react';

// TODO: expire token(?)

const AuthContext = React.createContext<{ token: string | null, isLoggedIn: boolean, login: (token: string) => void, logout: () => void }>({
    token: '',
    isLoggedIn: false,
    login: (token: string) => { },
    logout: () => { },
});

export const AuthContextProvider = (props: any) => {
    const storedToken = localStorage.getItem('token');

    const [token, setToken] = useState<string | null>(storedToken);

    const userIsLoggedIn = !!token;

    const logoutHandler = useCallback(() => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');

    }, []);

    const loginHandler = (token: string) => {
        setToken(token);
        localStorage.setItem('token', token);
    };

    const contextValue = {
        token: token,
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