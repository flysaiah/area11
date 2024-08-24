import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import React from 'react';
import Anime from '../../../Models/anime';
import Pane from '../../Pane/Pane';
import styles from './CatalogPane.module.css';
import CatalogCategory from "../CatalogCategory";
import CatalogFilters from "../../../Models/CatalogFilters";

type CatalogPaneProps = {
    filters: CatalogFilters;
    animeList: Anime[],
    setCurrentlySelected: React.Dispatch<React.SetStateAction<Anime | undefined>>,
    isLoading: boolean;
    forceRefresh: number
}

const CatalogPane: React.FC<CatalogPaneProps> = (props) => {

    // Setup

    // Filters

    const getFilteredList = (category:string) => {
        return props.animeList.filter(anime =>
            anime.category === category
            && (props.filters.category === CatalogCategory.AllCategories || props.filters.category === category)
        );
    }

    const wantToWatchList = getFilteredList(CatalogCategory.WantToWatch);
    const consideringList = getFilteredList(CatalogCategory.Considering);
    const completedList = getFilteredList(CatalogCategory.Completed);

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

    return props.isLoading ? (
        <Pane className={styles["catalog-pane"]}>
            <p>Loading catalog information...</p>
            <CircularProgress />
        </Pane>
    )
    : (
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
