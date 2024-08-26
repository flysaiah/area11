import { Button, Tooltip, useTheme } from "@mui/material";
import React, { Fragment } from 'react';
import sanitize from "sanitize-html";
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

    const sanitizeDescription = (description: string | undefined) => {
        if (!description) {
            return "";
        }

        return sanitize(description, {
            allowedTags: ["p", "b", "br", "em", "i", "span", "strong"],
            allowedAttributes: {},
            nonBooleanAttributes: [],
            selfClosing: ["br","hr"],
            allowedSchemes: [],
            allowedSchemesByTag:{},
            allowedSchemesAppliedToAttributes:[]
        })
    }

    const getFormattedDate = (date:string|undefined) => {
        if (!date) {
            return "Unknown";
        }

        const dObj = new Date(date);
        const res = dObj.toLocaleDateString();

        if (res === "Invalid Date") {
          return "Unkown";
        }

        return res;
    }

    const getRecommenders = (recommenders:{name:string}[] | undefined) => {
        if (!recommenders) {
            return "None";
        }

        if (recommenders.length < 1) {
            return "None";
        }

        return recommenders.map((item:{name:string}) => {
            return item.name
        }).join(", ");
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
                <div className={styles["content-details-container"]}>
                    <div className={styles["content-details-thumbnail-container"]}>
                        <img src={props.currentlySelected?.thumbnail} alt="Thumbnail not available." />
                    </div>
                    <div className={styles["content-details-misc-container"]}>
                        {props.currentlySelected?.endDate !== "OneAiredDate" ? (
                            <Fragment>
                                <p><strong>Started:</strong> {getFormattedDate(props.currentlySelected?.startDate)}</p>
                                <p><strong>Ended:</strong> {getFormattedDate(props.currentlySelected?.endDate)}</p>
                            </Fragment>
                            ) : null}
                        {props.currentlySelected?.endDate === "OneAiredDate" ? (
                                <p><strong>Aired:</strong> {getFormattedDate(props.currentlySelected?.startDate)}</p>
                            ) : null}
                        <Tooltip
                            PopperProps={{modifiers: [
                                {
                                  name: 'offset',
                                  options: {
                                    offset: [0, -50], // move tooltip left
                                  }
                                }
                            ]}}
                            placement="right"
                            title={<Fragment>Score ranking: {props.currentlySelected?.ranking ?? "Unknown"}<br/>Popularity ranking: {props.currentlySelected?.popularity ?? "Unknown"}</Fragment>}>
                            <p><strong>MAL rating:</strong> {props.currentlySelected?.rating ?? "Unknown"}</p>
                        </Tooltip>
                        <p><strong>Studios:</strong> {props.currentlySelected?.studios ?? "Unknown"}</p>
                        <p><strong>Type:</strong> {props.currentlySelected?.type ?? "Unknown"}</p>
                        <p><strong>English:</strong> {props.currentlySelected?.englishTitle ?? "Unknown"}</p>
                        <p><strong>Status:</strong> {props.currentlySelected?.status ?? "Unknown"}</p>
                        {props.currentlySelected?.runtime ? (<p><strong>Runtime:</strong> {props.currentlySelected.runtime}</p>) : null}
                        <p><strong>Genres:</strong> {props.currentlySelected?.genres?.join(", ") ?? "Unknown"}</p>
                        <p><strong>Recommenders:</strong> {getRecommenders(props.currentlySelected?.recommenders)}</p>
                    </div>
                </div>
                <p dangerouslySetInnerHTML={{"__html": sanitizeDescription(props.currentlySelected?.description)}}></p>
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
