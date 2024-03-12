import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Avatar, IconButton, Menu, MenuItem, useTheme } from "@mui/material";
import AuthContext from "../../Store/AuthContext";
import styles from './Header.module.css';
import OperationResult from "../../Models/operationresult";
import User from "../../Models/user";
import { useNavigate } from "react-router-dom";

const Header: React.FC<{}> = (props) => {

    // Setup
    const authContext = useContext(AuthContext);
    const theme = useTheme();
    const navigate = useNavigate();
    const [user, setUser] = useState<null | User>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleAvatarClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleAvatarMenuClose = () => {
        setAnchorEl(null);
    };

    const avatarMenuNavigate = (route:string) => {
        handleAvatarMenuClose();
        navigate(route);
        return;
    }

    const avatarMenuLogout = () => {
        handleAvatarMenuClose();
        authContext.logout();
        navigate("/login");
        return;
    }

    // Fetch

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'authorization': authContext.token! } // TODO: refactor into service
        };

        var uri = process.env.REACT_APP_BACKEND_URI + '/api/user/profile';

        fetch(uri, requestOptions)
            .then(response => response.json() as Promise<OperationResult>)
            .then(res => {
                if (!res?.success) {
                    console.log("Error fetching user information: " + res.message);
                    if (res.message.includes("Area11Error.Auth")) {
                        authContext.logout();
                        return;
                    }
                }
                setUser(res.data?.user);
            });

    }, [authContext]);

    var url = "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png";
    // TODO - integrate with Cloudinary for avatar
    // if (user?._id) {
    //     url = user._id;
    // }

    return (
        <div className={styles["top-wrapper"]}>
            <a onClick={() => navigate("/home")} className={styles["main-logo"]} style={{"color": theme.palette.primary.main}}>Area 11</a>
            <div className={styles["profile-container"]}>
                <span style={{"color": theme.palette.primary.main}} className={styles["profile-username"]}>{authContext.username}</span>
                <a className={styles["avatar-container"]} onClick={handleAvatarClick}>
                    <Avatar id="avatar" style={{"height": "50px", width: "50px"}} className={styles["profile-avatar"]} aria-label="avatar" src={url} />
                </a>
                <Menu
                    id="header-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleAvatarMenuClose}
                    MenuListProps={{
                        'aria-labelledby': 'avatar',
                    }}>
                    <MenuItem onClick={() => avatarMenuNavigate("/timeline")}>Timeline</MenuItem>
                    <MenuItem onClick={avatarMenuLogout}>Log out</MenuItem>
                </Menu>
            </div>
        </div>
    );
}

export default Header;
