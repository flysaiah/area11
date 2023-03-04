import React, { useState } from 'react';
import UserInfo from "../../Models/userInfo";
import Button from '@mui/material/Button';

const LoginForm: React.FC<{ submitForm: React.Dispatch<UserInfo> }> = (props) => {

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();

        setIsSubmitting(true);

        const data:UserInfo = new UserInfo(username, password);

        setUsername("");
        setPassword("");
        props.submitForm(data);
    }

    return (
        <form onSubmit={submitHandler}>
            <div>
                <h1>Log in</h1>
                <p>
                    <label htmlFor="username">Username</label>
                    <input id="username" name="username" required value={username} onChange={(event) => setUsername(event.target.value)} />
                </p>
                <p>
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" name="password" required value={password} onChange={(event) => setPassword(event.target.value)}/>
                </p>
                <div>
                    <Button variant="contained" type="submit" disabled={isSubmitting}>
                        Log In
                    </Button>
                </div>
            </div>
        </form>
    );
}

export default LoginForm;
