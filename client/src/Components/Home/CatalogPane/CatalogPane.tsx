import React, { useEffect, useState } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

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

        fetch('http://localhost:5000/api/anime/fetchAnime', requestOptions) // TODO: get URL from env
            .then(response => response.json())
            .then(data => {
                setAnimeList(data.animeList)
            });

    }, []);

    return (
        <React.Fragment>
            { }
            <List
                sx={{
                    maxHeight: 500,
                    overflow: 'auto'
                }}
            >
                {wantToWatchList.map(anime => (
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary={anime.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List
                sx={{
                    maxHeight: 500,
                    overflow: 'auto'
                }}
            >
                {consideringList.map(anime => (
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary={anime.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List
                sx={{
                    maxHeight: 500,
                    overflow: 'auto'
                }}
            >
                {completedList.map(anime => (
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary={anime.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </React.Fragment>
    );
}

export default CatalogPane;
