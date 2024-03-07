import React, { useContext, useEffect, useState } from 'react';
import { useTheme } from "@mui/material";
import AuthContext from "../../Store/AuthContext";
import styles from './Navbar.module.css';

const Navbar: React.FC<{}> = (props) => {

    // Setup
    const authContext = useContext(AuthContext);
    const theme = useTheme();

    // Fetch

    useEffect(() => {

    }, []);

    // JSX

    var listSX = {
        maxHeight: "700px",
        overflow: "auto",
        paddingTop: "0px"
    }

    var subheaderSX = {
        border: "1px solid #c3c3c3",
        borderWidth: "2px",
        lineHeight: "30px"
    }

    return (
    <div className={styles["search-toolbar"]} style={{"backgroundColor": theme.palette.primary.main}}>
        <div className={styles["search-toolbar-inner-container"]}>
            TEST
        </div>
    </div>
    );
}

export default Navbar;
