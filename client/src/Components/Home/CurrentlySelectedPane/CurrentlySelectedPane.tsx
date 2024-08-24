import { Button, useTheme } from "@mui/material";
import React from 'react';
import Anime from "../../../Models/anime";
import Pane from '../../Pane/Pane';
import styles from './CurrentlySelectedPane.module.css'
import CatalogCategory from "../CatalogCategory";

const CurrentlySelectedPane: React.FC<{
    currentlySelected: Anime | undefined,
    handleCurrentlySelectedAnimeUpdate: () => void}> = (props) => {

    const theme = useTheme();

    const updateCategory = (newCategory: string) => {
        props.currentlySelected!.category = newCategory;
        props.handleCurrentlySelectedAnimeUpdate();
    }

    var noSelectionPlaceholder = (
        <Pane>
            <div className={styles["content-container"]}>
                Click on anime in any of your lists to see details from MAL here!
            </div>
        </Pane>
    )

    var regularView = (
        <Pane className={styles.pane}>
            <div className={styles["content-container"]}>
                <h2 className={styles.title}>{props.currentlySelected?.name}</h2>
                <img src={props.currentlySelected?.thumbnail} alt="Thumbnail not available." />
                <p>Genres: {props.currentlySelected?.genres?.join(", ")}</p>
                <p>{props.currentlySelected?.description}</p>
            </div>
            <div className={styles["button-container"]}>
                {props.currentlySelected?.category === CatalogCategory.WantToWatch ? null : (<Button variant="contained" style={{"backgroundColor": theme.palette.secondary.main, "marginRight": "5px", "marginLeft": "5px"}} onClick={() => updateCategory(CatalogCategory.WantToWatch) }>Move to Want to Watch</Button>)}
                {props.currentlySelected?.category === CatalogCategory.Considering ? null : (<Button variant="contained" style={{"backgroundColor": theme.palette.secondary.main, "marginRight": "5px", "marginLeft": "5px"}} onClick={() => updateCategory(CatalogCategory.Considering)}>Move to Considering</Button>)}
                {props.currentlySelected?.category === CatalogCategory.Completed ? null : (<Button variant="contained" style={{"backgroundColor": theme.palette.secondary.main, "marginRight": "5px", "marginLeft": "5px"}} onClick={() => updateCategory(CatalogCategory.Completed)}>Move to Completed</Button>)}
            </div>
        </Pane>
    )

    return props.currentlySelected == null ? noSelectionPlaceholder : regularView;
}

export default CurrentlySelectedPane;
