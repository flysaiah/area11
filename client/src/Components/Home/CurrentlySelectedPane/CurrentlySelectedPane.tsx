import { Button, Tooltip, useTheme } from "@mui/material";
import React, { Fragment, useContext } from 'react';
import sanitize from "sanitize-html";
import Anime from "../../../Models/anime";
import Pane from '../../Pane/Pane';
import styles from './CurrentlySelectedPane.module.css'
import CatalogCategory from "../CatalogCategory";
import AuthContext from "../../../Store/AuthContext";

type CurrentlySelectedPaneProps = {
    currentlySelected: Anime | undefined;
    preventCatalogActions: boolean;
    updateCurrentlySelected: () => void;
    deleteCurrentlySelected: () => void;
    showToast: (message:string, isError:boolean) => void;
}

const CurrentlySelectedPane: React.FC<CurrentlySelectedPaneProps> = (props) => {

    const authContext = useContext(AuthContext);
    const theme = useTheme();

    const updateCategory = (newCategory: string) => {
        props.currentlySelected!.category = newCategory;
        props.updateCurrentlySelected();
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

    const isSelfRecommended = (anime:Anime|undefined) => {
        if (!anime?.recommenders || anime.recommenders.length < 1) {
            return false;
        }

        for (let i=0; i<anime.recommenders.length; i++) {
            if (anime.recommenders[i].name === authContext.username) {
                return true;
            }
        }

        return false;
    }

    const recommend = () => {
        const idx = props.currentlySelected!.recommenders!.map(r => r.name).indexOf(authContext.username!);

        if (idx !== -1) {
            console.log("User is already in recommenders. This shouldn't happen.");
            props.showToast("Unexpected error when trying to perform recommendation. Please refresh and try again.", true);
            return;
        }

        props.currentlySelected!.recommenders!.push({name: authContext.username!});
        props.updateCurrentlySelected();
    }

    const unrecommend = () => {
        const idx = props.currentlySelected!.recommenders!.map(r => r.name).indexOf(authContext.username!);

        if (idx === -1) {
            console.log("Did not find user in recommenders. This shouldn't happen.");
            props.showToast("Unexpected error when trying to undo recommendation. Please refresh and try again.", true);
            return;
        }

        props.currentlySelected!.recommenders!.splice(idx, 1);
        props.updateCurrentlySelected();
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
                {props.currentlySelected?.category === CatalogCategory.WantToWatch ? null : (<Button disabled={props.preventCatalogActions} variant="contained" style={{"backgroundColor": theme.palette.secondary.main, "marginRight": "5px", "marginLeft": "5px", "marginBottom": "5px"}} onClick={() => updateCategory(CatalogCategory.WantToWatch) }>Move to Want to Watch</Button>)}
                {props.currentlySelected?.category === CatalogCategory.Considering ? null : (<Button disabled={props.preventCatalogActions} variant="contained" style={{"backgroundColor": theme.palette.secondary.main, "marginRight": "5px", "marginLeft": "5px", "marginBottom": "5px"}} onClick={() => updateCategory(CatalogCategory.Considering)}>Move to Considering</Button>)}
                {props.currentlySelected?.category === CatalogCategory.Completed ? null : (<Button disabled={props.preventCatalogActions} variant="contained" style={{"backgroundColor": theme.palette.secondary.main, "marginRight": "5px", "marginLeft": "5px", "marginBottom": "5px"}} onClick={() => updateCategory(CatalogCategory.Completed)}>Move to Completed</Button>)}
                {!isSelfRecommended(props.currentlySelected) ? (<Button disabled={props.currentlySelected?.category !== CatalogCategory.Completed || props.preventCatalogActions} variant="contained" style={{"backgroundColor": props.currentlySelected?.category !== CatalogCategory.Completed ? "lightgrey" : theme.palette.primary.main, "marginRight": "5px", "marginLeft": "5px", "marginBottom": "5px"}} onClick={recommend}>Recommend</Button>): null}
                {isSelfRecommended(props.currentlySelected) ? (<Button disabled={props.preventCatalogActions} variant="contained" style={{"backgroundColor": theme.palette.primary.main, "marginRight": "5px", "marginLeft": "5px", "marginBottom": "5px"}} onClick={unrecommend}>Undo Recommend</Button>): null}
                <Button disabled={props.preventCatalogActions} variant="contained" style={{"backgroundColor": theme.palette.warning.main, "marginRight": "5px", "marginLeft": "5px", "marginBottom": "5px"}} onClick={props.deleteCurrentlySelected}>Remove from Catalog</Button>
            </div>
        </Pane>        
    )

    return props.currentlySelected == null ? noSelectionPlaceholder : regularView;
}

export default CurrentlySelectedPane;
