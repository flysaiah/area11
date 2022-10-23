import React from 'react';
import styles from './Home.module.css';

import CatalogPane from './CatalogPane/CatalogPane';
import CurrentlySelectedPane from './CurrentlySelectedPane/CurrentlySelectedPane';
import FinalistsPane from './FinalistsPane/FinalistsPane';

import Grid from '@mui/material/Grid';

const Home = () => {
    return (
        <Grid container justifyContent="space-around">
            <Grid item xs={3} height={750}>
                <CatalogPane />
            </Grid>
            <Grid item xs={4} height={750}>
                <CurrentlySelectedPane />
            </Grid>
            <Grid item xs={3} height={750}>
                <FinalistsPane />
            </Grid>
        </Grid>
    );
}

export default Home;
