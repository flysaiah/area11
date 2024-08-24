import Grid from '@mui/material/Grid';
import { Fragment, useContext, useEffect, useState } from 'react';
import Anime from '../../Models/anime';
import CatalogPane from './CatalogPane/CatalogPane';
import CurrentlySelectedPane from './CurrentlySelectedPane/CurrentlySelectedPane';
import FinalistsPane from './FinalistsPane/FinalistsPane';
import Navbar from "../Navbar/Navbar";
import Header from "../Header/Header";
import styles from './Home.module.css';
import CatalogCategory from "./CatalogCategory";
import CatalogFilters from "../../Models/CatalogFilters";
import AuthContext from "../../Store/AuthContext";
import OperationResult from "../../Models/operationresult";
import CatalogAutocomplete from "./CatalogAutocomplete/CatalogAutocomplete";

const Home = () => {

    // Setup

    const authContext = useContext(AuthContext);

    const [animeList, setAnimeList] = useState<Anime[]>([]);
    const [currentlySelected, setCurrentlySelected] = useState<Anime>();
    const [filters, setFilters] = useState<CatalogFilters>(new CatalogFilters(CatalogCategory.AllCategories));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const updateSelectedCategory = (category: string) => {
        setFilters({
            ...filters,
            category: category
        })
    };

    // Fetch

    useEffect(() => {
        let username = authContext.username!;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'authorization': authContext.token! }, // TODO: refactor into service
            body: JSON.stringify({ username: username })
        };

        var uri = process.env.REACT_APP_BACKEND_URI + '/api/anime/fetchAnime'; // move to service

        fetch(uri, requestOptions)
            .then(response => response.json() as Promise<OperationResult>)
            .then(res => {
                if (!res?.success) {
                    console.log("Error fetching anime list: " + res.message);

                    if (res.message.includes("Area11Error.Auth")) {
                        authContext.logout();
                        return;
                    }
                }

                setAnimeList(res?.data.animeList);
                setIsLoading(false);
            });

    }, [authContext]);

    return (
        <Fragment>
            <Header></Header>
            <Navbar>
                <div className={styles["search-toolbar-inner-container"]}>
                    <label className={styles["category-select-label"]} htmlFor="category-select">Filter by Category:</label>
                    <select id="category-select" onChange={(event) => updateSelectedCategory(event.target.value)}>
                        <option>{CatalogCategory.AllCategories}</option>
                        <option>{CatalogCategory.WantToWatch}</option>
                        <option>{CatalogCategory.Considering}</option>
                        <option>{CatalogCategory.Completed}</option>
                    </select>
                    <label className={styles["search-autocomplete-label"]} htmlFor="autocomplete">Search for anime:</label>
                    <CatalogAutocomplete animeList={animeList} setCurrentlySelected={setCurrentlySelected} />
                </div>
            </Navbar>
            <Grid container justifyContent="space-around">
                <Grid item xs={3}>
                    <CatalogPane isLoading={isLoading} animeList={animeList} filters={filters} setCurrentlySelected={setCurrentlySelected} />
                </Grid>
                <Grid item xs={4}>
                    <CurrentlySelectedPane currentlySelected={currentlySelected} />
                </Grid>
                <Grid item xs={3}>
                    <FinalistsPane isLoading={isLoading} />
                </Grid>
            </Grid>
        </Fragment>
    );
}

export default Home;
