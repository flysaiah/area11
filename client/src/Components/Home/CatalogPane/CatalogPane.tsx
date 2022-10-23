import React, { useEffect, useState } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';

import Pane from '../../Pane/Pane';

import styles from './CatalogPane.module.css';

import Anime from '../../../Models/anime';

const CatalogPane = () => {

    const [animeList, setAnimeList] = useState<Anime[]>([]);

    const wantToWatchList = animeList.filter(anime => anime.category == "Want to Watch");
    const consideringList = animeList.filter(anime => anime.category == "Considering");
    const completedList = animeList.filter(anime => anime.category == "Completed");

    useEffect(() => {
        let username = localStorage.getItem("area11") // TODO: will eventually come from auth
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username })
        };

        var uri = process.env.REACT_APP_BACKEND_URI + '/api/anime/fetchAnime'; // move to service
        console.log(uri)

        fetch(uri, requestOptions)
            .then(response => response.json())
            .then(data => {
                setAnimeList(data.animeList)
            });

    }, []);

    return (
        <Pane>
            <List dense={true}
                sx={{
                    maxHeight: '100%',
                    overflow: 'auto'
                }}
            >
                <ListSubheader color='primary' className={styles["category-subheader"]}>Want to Watch ({wantToWatchList.length})</ListSubheader>
                {wantToWatchList.map(anime => (
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary={anime.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <Divider />
                <ListSubheader color='primary' className={styles["category-subheader"]}>Considering ({consideringList.length})</ListSubheader>
                {consideringList.map(anime => (
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary={anime.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <Divider />
                <ListSubheader color='primary' className={styles["category-subheader"]}>Completed ({completedList.length})</ListSubheader>
                {completedList.map(anime => (
                    <ListItem disablePadding>
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
