import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import React, { useEffect, useState } from 'react';
import Anime from '../../../Models/anime';
import Pane from '../../Pane/Pane';
import styles from './CatalogPane.module.css';

const CatalogPane: React.FC<{ setCurrentlySelected: React.Dispatch<React.SetStateAction<Anime | undefined>> }> = (props) => {

    // Setup

    const [animeList, setAnimeList] = useState<Anime[]>([]);

    const wantToWatchList = animeList.filter(anime => anime.category == "Want to Watch");
    const consideringList = animeList.filter(anime => anime.category == "Considering");
    const completedList = animeList.filter(anime => anime.category == "Completed");

    // Fetch

    useEffect(() => {
        let username = localStorage.getItem("area11") // TODO: will eventually come from auth
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username })
        };

        var uri = process.env.REACT_APP_BACKEND_URI + '/api/anime/fetchAnime'; // move to service

        fetch(uri, requestOptions)
            .then(response => response.json())
            .then(data => {
                setAnimeList(data.animeList);
            });

    }, []);

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
                <ListSubheader color="primary" sx={subheaderSX}>Want to Watch ({wantToWatchList.length})</ListSubheader>
                {wantToWatchList.map(anime => (
                    <ListItem disablePadding onClick={() => props.setCurrentlySelected(anime)}>
                        <ListItemButton>
                            <ListItemText primary={anime.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <Divider />
                <ListSubheader color="primary" sx={subheaderSX}>Considering ({consideringList.length})</ListSubheader>
                {consideringList.map(anime => (
                    <ListItem disablePadding onClick={() => props.setCurrentlySelected(anime)}>
                        <ListItemButton>
                            <ListItemText primary={anime.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <Divider />
                <ListSubheader color="primary" sx={subheaderSX}>Completed ({completedList.length})</ListSubheader>
                {completedList.map(anime => (
                    <ListItem disablePadding onClick={() => props.setCurrentlySelected(anime)}>
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
