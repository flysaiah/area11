import Grid from '@mui/material/Grid';
import { useState } from 'react';
import Anime from '../../Models/anime';
import CatalogPane from './CatalogPane/CatalogPane';
import CurrentlySelectedPane from './CurrentlySelectedPane/CurrentlySelectedPane';
import FinalistsPane from './FinalistsPane/FinalistsPane';

const Home = () => {

    const [currentlySelected, setCurrentlySelected] = useState<Anime>();

    return (
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
    );
}

export default Home;
