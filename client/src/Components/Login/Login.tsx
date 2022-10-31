import React, { useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Store/AuthContext";

const Login = () => {
    const navigate = useNavigate();

    const authContext = useContext(AuthContext);

    useEffect(() => {
        if (authContext.isLoggedIn) {
            navigate("/home", {replace: true});
            return;
        }
    }, [authContext]);

    return (
        <React.Fragment>
            Temp stuff
        </React.Fragment>
    );
}

export default Login;
