import Grid from '@mui/material/Grid';
import { Fragment, useState } from 'react';
import Anime from '../../Models/anime';
import CatalogPane from './CatalogPane/CatalogPane';
import CurrentlySelectedPane from './CurrentlySelectedPane/CurrentlySelectedPane';
import FinalistsPane from './FinalistsPane/FinalistsPane';
import Navbar from "../Navbar/Navbar";
import Header from "../Header/Header";
import styles from './Home.module.css';

const Home = () => {
    const [currentlySelected, setCurrentlySelected] = useState<Anime>();

    return (
        <Fragment>
            <Header></Header>
            <Navbar>
                <div className={styles["search-toolbar-inner-container"]}>
                    TEST
                </div>
            </Navbar>
            <Grid container justifyContent="space-around">
                <Grid item xs={3}>
                    <CatalogPane setCurrentlySelected={setCurrentlySelected} />
                </Grid>
                <Grid item xs={4}>
                    <CurrentlySelectedPane currentlySelected={currentlySelected} />
                </Grid>
                <Grid item xs={3}>
                    <FinalistsPane />
                </Grid>
            </Grid>
        </Fragment>
    );
}

export default Home;
