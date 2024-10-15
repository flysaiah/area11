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
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

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
    const [preventCatalogActions, setPreventCatalogActions] = useState<boolean>(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

    const safeSetCurrentlySelected = (anime:Anime|undefined) => {
        if (!preventCatalogActions) {
            setCurrentlySelected(anime);
        }
    }

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

    const updateCurrentlySelected = (toastMessage: string) =>  {
        updateAnime(currentlySelected, toastMessage);
    }

    const updateAnime = (anime: Anime | undefined, toastMessage: string) => {
        if (preventCatalogActions) {
            return;
        }

        setPreventCatalogActions(true);

        if (!anime) {
            console.log("Error: no anime to update!");
            return;
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'authorization': authContext.token! }, // TODO: refactor all of this into service
            body: JSON.stringify({
                id: anime._id,
                category: anime.category,
                recommenders: anime.recommenders,
                isFinalist: anime.isFinalist })
        };

        var uri = process.env.REACT_APP_BACKEND_URI + '/api/anime/updateAnime';

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
                    props.showToast(toastMessage, false);

                    doLocalRefresh();
                }

                setPreventCatalogActions(false);
            });
    }

    const deleteCurrentlySelected = () => {
        setPreventCatalogActions(true);
        setOpenDeleteDialog(true);
    }

    const handleDeleteDialogClose = (deleteConfirmed:boolean) => {
        if (deleteConfirmed) {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'authorization': authContext.token! }, // TODO: refactor all of this into service
                body: JSON.stringify({ id: currentlySelected?._id })
            };
    
            var uri = process.env.REACT_APP_BACKEND_URI + '/api/anime/deleteAnime';
    
            fetch(uri, requestOptions)
                .then(response => response.json() as Promise<OperationResult>)
                .then(res => {
                    if (!res?.success) {
                        console.log("Error deleting anime: " + res.message);
                        props.showToast("Error deleting anime.", true);
    
                        if (res.message.includes("Area11Error.Auth")) {
                            authContext.logout();
                            return;
                        }
                    }
                    else {
                        props.showToast("Successfully deleted anime!", false);
                    }
    
                    setCurrentlySelected(undefined);
                    doServerRefresh();
                    setPreventCatalogActions(false);
                    setOpenDeleteDialog(false);
                });
        }
        else {
            setPreventCatalogActions(false);
            setOpenDeleteDialog(false);
        }
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
                    console.log("Error fetching anime list. Message: " + res.message + ". Data: " + res.data);
                    props.showToast("Error fetching anime list. Please try again.", true);
                    setIsLoading(false);

                    if (res.message.includes("Area11Error.Auth")) {
                        authContext.logout();
                    }

                    return;
                }

                setAnimeList(res?.data.animeList);
                setIsLoading(false);
            });

    }, [authContext, forceServerRefresh]);

    return (
        <Fragment>
            <Header></Header>
            <Navbar>
                <div className={styles["search-toolbar-inner-container"]}>
                    {addAnimeToolOpen ? null : <button disabled={preventCatalogActions} className={styles["add-anime-button"]} onClick={() => setAddAnimeToolOpen(true)}>Add Anime</button>}
                    {!addAnimeToolOpen ? null : <button disabled={preventCatalogActions} className={styles["add-anime-button"]} onClick={() => setAddAnimeToolOpen(false)}>Stop Adding Anime</button>}
                    <label className={styles["category-select-label"]} htmlFor="category-select">Filter by Category:</label>
                    <select disabled={preventCatalogActions} id="category-select" onChange={(event) => updateSelectedCategory(event.target.value)}>
                        <option>{CatalogCategory.AllCategories}</option>
                        <option>{CatalogCategory.WantToWatch}</option>
                        <option>{CatalogCategory.Considering}</option>
                        <option>{CatalogCategory.Completed}</option>
                    </select>
                    <label className={styles["search-autocomplete-label"]} htmlFor="autocomplete">Search for anime:</label>
                    <CatalogAutocomplete animeList={animeList} setCurrentlySelected={safeSetCurrentlySelected} preventCatalogActions={preventCatalogActions} />
                </div>
            </Navbar>
            <Grid container justifyContent="space-around">
                <Grid item xs={3}>
                    {!addAnimeToolOpen ? null : <AddAnimeTool handleAddAnimeComplete={doServerRefresh} showToast={props.showToast} preventCatalogActions={preventCatalogActions}/>}
                    <CatalogPane isLoading={isLoading} animeList={animeList} filters={filters} setCurrentlySelected={safeSetCurrentlySelected} forceRefresh={forceRefresh} />
                </Grid>
                <Grid item xs={4}>
                    <CurrentlySelectedPane currentlySelected={currentlySelected} preventCatalogActions={preventCatalogActions} updateCurrentlySelected={updateCurrentlySelected} deleteCurrentlySelected={deleteCurrentlySelected} showToast={props.showToast}/>
                </Grid>
                <Grid item xs={3}>
                    <FinalistsPane isLoading={isLoading} animeList={animeList} setCurrentlySelected={setCurrentlySelected} updateAnime={updateAnime} />
                </Grid>
            </Grid>
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                aria-labelledby="delete-dialog-title"
            >
                <DialogTitle id="delete-dialog-title">
                Confirm Deletion of {currentlySelected?.name}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete {currentlySelected?.name} from your catalog?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => handleDeleteDialogClose(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => handleDeleteDialogClose(true)}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export default Home;
