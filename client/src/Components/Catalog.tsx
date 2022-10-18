import React, { useEffect, useState } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import Anime from '../Models/anime';
import { getToolbarUtilityClass } from '@mui/material';

const Catalog = () => {

    const [animeList, setAnimeList] = useState<Anime[]>([]);

    // Dummy code
    animeList.push({"name": "Sword Art Online", "user": "flysaiah"});
    animeList.push({"name": "Spice and Wolf", "user": "flysaiah"});
    animeList.push({"name": "Gurren Lagann", "user": "flysaiah"});
    animeList.push({"name": "Madoka Magica", "user": "flysaiah"});

    // end dummy code

    useEffect(() =>
    {
        // TODO
    }, []);

    return (
    <React.Fragment>
        <List>
            {animeList.map(anime => (
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemText primary={anime.name} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
        <Divider />
        <List>
            <ListItem disablePadding>
            <ListItemButton>
                <ListItemText primary="Dummy List Two" />
            </ListItemButton>
            </ListItem>
        </List>
    </React.Fragment>
    );
}

export default Catalog;
