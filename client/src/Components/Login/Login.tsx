import React, { useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Store/AuthContext";
import LoginForm from "./LoginForm";
import UserInfo from "../../Models/userInfo";

const Login = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    useEffect(() => {
        if (authContext.isLoggedIn) {
            navigate("/home", {replace: true});
            return;
        }
    }, [authContext, navigate]);

    const submit = (userInfo: UserInfo) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: userInfo.username, password: userInfo.password })
        };

        var uri = process.env.REACT_APP_BACKEND_URI + '/authentication/login'; // move to service

        fetch(uri, requestOptions)
            .then(response => response.json())
            .then(data => {
                // TODO: error handling

                authContext.login(data.token);
            });
    }

    return (
        <LoginForm submitForm={submit}/>
    );
}

export default Login;
