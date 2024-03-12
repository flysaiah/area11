import React, { PropsWithChildren, useContext, useEffect, useState } from 'react';
import { useTheme } from "@mui/material";
import styles from './Navbar.module.css';

const Navbar: React.FC<PropsWithChildren> = (props:React.PropsWithChildren) => {

    // Setup
    const theme = useTheme();

    // JSX

    return (
        <div className={styles["search-toolbar"]} style={{"backgroundColor": theme.palette.primary.main}}>
            {props.children}
        </div>
    );
}

export default Navbar;
