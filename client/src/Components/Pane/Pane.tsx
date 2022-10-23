import React from 'react';

import styles from './Pane.module.css'

const Pane = (props:any) => {
    return (
        <div className={styles.pane}>
            {props.children}
        </div>
    );
}

export default Pane;
