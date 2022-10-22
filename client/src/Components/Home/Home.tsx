import React from 'react';
import styles from './Home.module.css';

import CatalogPane from './CatalogPane/CatalogPane';
import CurrentlySelectedPane from './CurrentlySelectedPane/CurrentlySelectedPane';
import FinalistsPane from './FinalistsPane/FinalistsPane';

const Home = () => {
    return (
        <div className={styles["home-container"]}>
            <div className={styles["home-pane"]}>
                <CatalogPane />
            </div>
            <div className={styles["home-pane"]}>
                <CurrentlySelectedPane />
            </div>
            <div className={styles["home-pane"]}>
                <FinalistsPane />
            </div>
        </div>
    );
}

export default Home;
