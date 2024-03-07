import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import React, { useContext, useEffect, useState } from 'react';
import Anime from '../../../Models/anime';
import AuthContext from "../../../Store/AuthContext";
import Pane from '../../Pane/Pane';
import styles from './CatalogPane.module.css';
import OperationResult from "../../../Models/operationresult";

const CatalogPane: React.FC<{ setCurrentlySelected: React.Dispatch<React.SetStateAction<Anime | undefined>> }> = (props) => {

    // Setup
    const authContext = useContext(AuthContext);
    const [animeList, setAnimeList] = useState<Anime[]>([]);

    const wantToWatchList = animeList.filter(anime => anime.category === "Want to Watch");
    const consideringList = animeList.filter(anime => anime.category === "Considering");
    const completedList = animeList.filter(anime => anime.category === "Completed");

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
            });

    }, [authContext]);

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
        <Pane className={styles["catalog-pane"]}>
            <List dense={true} sx={listSX}>
                <ListSubheader sx={subheaderSX}>Want to Watch ({wantToWatchList.length})</ListSubheader>
                {wantToWatchList.map(anime => (
                    <ListItem disablePadding key={anime._id} onClick={() => props.setCurrentlySelected(anime)}>
                        <ListItemButton>
                            <ListItemText primary={anime.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <Divider />
                <ListSubheader sx={subheaderSX}>Considering ({consideringList.length})</ListSubheader>
                {consideringList.map(anime => (
                    <ListItem disablePadding key={anime._id} onClick={() => props.setCurrentlySelected(anime)}>
                        <ListItemButton>
                            <ListItemText primary={anime.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <Divider />
                <ListSubheader sx={subheaderSX}>Completed ({completedList.length})</ListSubheader>
                {completedList.map(anime => (
                    <ListItem disablePadding key={anime._id} onClick={() => props.setCurrentlySelected(anime)}>
                        <ListItemButton>
                            <ListItemText primary={anime.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Pane>
    );
}

export default CatalogPane;
