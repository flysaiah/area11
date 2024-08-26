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
import AddAnimeTool from './AddAnimeTool/AddAnimeTool';

type HomeProps = {
    showToast: (message:string, isError:boolean) => void;
}

const Home: React.FC<HomeProps> = (props) => {

    // Setup

    const authContext = useContext(AuthContext);

    const [animeList, setAnimeList] = useState<Anime[]>([]);
    const [currentlySelected, setCurrentlySelected] = useState<Anime>();
    const [filters, setFilters] = useState<CatalogFilters>(new CatalogFilters(CatalogCategory.AllCategories));
    const [addAnimeToolOpen, setAddAnimeToolOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [forceRefresh, setForceRefresh] = useState<number>(0);
    const [forceServerRefresh, setForceServerRefresh] = useState<number>(0);

    const doLocalRefresh = () => {
        setForceRefresh(forceRefresh > 0 ? forceRefresh - 1 : forceRefresh + 1);
    }

    const doServerRefresh = () => {
        setForceServerRefresh(forceServerRefresh > 0 ? forceServerRefresh - 1 : forceServerRefresh + 1)
    }

    const updateSelectedCategory = (category: string) => {
        setFilters({
            ...filters,
            category: category
        })
    };

    const handleCurrentlySelectedAnimeUpdate = () =>  {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'authorization': authContext.token! }, // TODO: refactor into service
            body: JSON.stringify({ id: currentlySelected?._id, category: currentlySelected?.category })
        };

        var uri = process.env.REACT_APP_BACKEND_URI + '/api/anime/changeCategory'; // move to service

        fetch(uri, requestOptions)
            .then(response => response.json() as Promise<OperationResult>)
            .then(res => {
                if (!res?.success) {
                    console.log("Error updating anime: " + res.message);
                    props.showToast("Error updating anime.", true);

                    if (res.message.includes("Area11Error.Auth")) {
                        authContext.logout();
                        return;
                    }
                    doServerRefresh();
                }
                else {
                    props.showToast("Successfully updated category!", false);

                    doLocalRefresh();
                }
            });

    }

    // Fetch

    useEffect(() => {
        setIsLoading(true);

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'authorization': authContext.token! } // TODO: refactor into service
        };

        var uri = process.env.REACT_APP_BACKEND_URI + '/api/anime/fetchAnime'; // move to service

        fetch(uri, requestOptions)
            .then(response => response.json() as Promise<OperationResult>)
            .then(res => {
                if (!res?.success) {
                    console.log("Error fetching anime list: " + res.message);
                    props.showToast("Error fetching anime list:.", true);

                    if (res.message.includes("Area11Error.Auth")) {
                        authContext.logout();
                        return;
                    }
                }

                setAnimeList(res?.data.animeList);
                setIsLoading(false);
            });

    }, [props, authContext, forceServerRefresh]);

    return (
        <Fragment>
            <Header></Header>
            <Navbar>
                <div className={styles["search-toolbar-inner-container"]}>
                    {addAnimeToolOpen ? null : <button className={styles["add-anime-button"]} onClick={() => setAddAnimeToolOpen(true)}>Add Anime</button>}
                    {!addAnimeToolOpen ? null : <button className={styles["add-anime-button"]} onClick={() => setAddAnimeToolOpen(false)}>Stop Adding Anime</button>}
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
                    {!addAnimeToolOpen ? null : <AddAnimeTool handleAddAnimeComplete={doServerRefresh} showToast={props.showToast}/>}
                    <CatalogPane isLoading={isLoading} animeList={animeList} filters={filters} setCurrentlySelected={setCurrentlySelected} forceRefresh={forceRefresh} />
                </Grid>
                <Grid item xs={4}>
                    <CurrentlySelectedPane currentlySelected={currentlySelected} handleCurrentlySelectedAnimeUpdate={handleCurrentlySelectedAnimeUpdate} />
                </Grid>
                <Grid item xs={3}>
                    <FinalistsPane isLoading={isLoading} />
                </Grid>
            </Grid>
        </Fragment>
    );
}

export default Home;
