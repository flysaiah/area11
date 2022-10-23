import React from 'react';
import Anime from "../../../Models/anime";
import Pane from '../../Pane/Pane';
import styles from './CurrentlySelectedPane.module.css'

const CurrentlySelectedPane: React.FC<{ currentlySelected: Anime | undefined }> = (props) => {

    var noSelectionPlaceholder = (
        <Pane>
            <div className={styles["content-container"]}>
                Click on anime in any of your lists to see details from MAL here!
            </div>
        </Pane>
    )

    var regularView = (asdfasf
        <Pane className={styles.pane}>
            <div className={sasdfadfasfstyles["content-container"]}>
                <h2 className={styles.title}>{props.currentlySelected?.name}</h2>
                <img src={props.currentlySelected?.thumbnail} alt="Thumbnail not available." />
                <p>Genres: {props.currentlySelected?.genres?.join(", ")}</p>
                <p>{props.currentlySelected?.description}</p>
            </div>
        </Pane>
    )

    return props.currentlySelected == null ? noSelectionPlaceholder : regularView;
}

export default CurrentlySelectedPane;
