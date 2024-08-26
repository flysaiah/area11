import { Button, Card, CardActions, CardContent, TextField, useTheme } from "@mui/material";
import React, { useState } from 'react';
import Era from "../../../Models/era";
import styles from './EraCard.module.css';
const EraCard:React.FC<{
    era: Era,
    index: number,
    editingEraIndex: number,
    setEditingEraIndex: React.Dispatch<React.SetStateAction<number>>,
    saveChanges: (era:Era) => void,
    canAddNewEra: boolean,
    addNewEra: () => void}> = (props) => {

    const theme = useTheme();

    const [entries, setEntries] = useState<string>(props.era.entries.join("\n"));
    const [name, setName] = useState<string>(props.era.name);
    const [subHeader, setSubHeader] = useState<string>(props.era.subHeader);
    const [startDate, setStartDate] = useState<string>(props.era.startDate);
    const [endDate, setEndDate] = useState<string>(props.era.endDate);

    var era = props.era;
    const originalEntries = props.era.entries.join("\n");

    const getReadOnlyHeaders = () => {
        return (
            <React.Fragment>
                <h1 className={styles["era-title"]}>{era.name}</h1>
                <p className={styles["era-subheader"]}><i>{era.subHeader != null ? era.subHeader : ""}</i></p>
                <p>{getDateInfo()}</p>
            </React.Fragment>);
    }

    const getReadOnlyEntries = () => {
        return entries.split("\n").map((entry, idx) => (
            <p key={era.name + "_entry_" + idx} className={styles["entry"]}>{entry}</p>
        ));
    };

    const getEditableHeaders = () => {
        return (
            <React.Fragment>
                <TextField margin="normal" size="small" label="Era Name" variant="outlined" value={name} onChange={(event) => setName(event.target.value)} />
                <TextField margin="normal" size="small" label="Era Subheader" variant="outlined" value={subHeader} onChange={(event) => setSubHeader(event.target.value)} />
                <br/>
                <TextField margin="normal" size="small" label="Start Date" variant="outlined" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
                <TextField margin="normal" size="small" label="End Date" variant="outlined" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
            </React.Fragment>);
    }

    const getEditableEntries = () => {
        return (
            <textarea
                value={entries}
                onChange={(event) => setEntries(event.target.value)}
                className={styles["entries-editable"]}></textarea>
        );
    };

    const cardSX = {
        backgroundColor: era.backgroundColor
    };

    const saveChanges = () => {
        const newEra = new Era(name, subHeader, entries.split("\n"), startDate, endDate, era.backgroundColor, era.whiteText);
        props.saveChanges(newEra);
    }

    const cancelChanges = () => {
        setEntries(originalEntries);
        props.setEditingEraIndex(-1);
    }

    const isEditing = () => {
        return props.index === props.editingEraIndex;
    }

    const isEditable = () => {
        return props.editingEraIndex === -1;
    }

    const getDateInfo = () => {
        if (era.startDate && era.endDate) {
            if (era.startDate === era.endDate) {
                return era.startDate
            } else {
                return era.startDate + " - " + era.endDate
            }
        } else if (era.startDate) {
            return era.startDate
        } else {
            return "";
        }
    }

    return (
        <Card variant="elevation" className={styles["card"]} sx={cardSX}>
            <CardContent>
                <div className={styles["era-header"]}>
                    {isEditing() ?
                    getEditableHeaders() :
                    getReadOnlyHeaders()}
                </div>
                <hr className={styles["era-horizontal-line"]} />
                <div>
                    {isEditing() ?
                    getEditableEntries() :
                    getReadOnlyEntries()}    
                </div>
            </CardContent>
            <CardActions>
                {isEditing() ? (<Button variant="contained" style={{"backgroundColor": theme.palette.secondary.main}} onClick={saveChanges}>Save</Button>) : null}
                {isEditing() ? (<Button variant="contained" style={{"backgroundColor": theme.palette.warning.main}} onClick={cancelChanges}>Cancel</Button>) : null}
                {!isEditing() ? (<Button variant="contained" style={{"backgroundColor": theme.palette.secondary.main}} disabled={!isEditable()} onClick={() => props.setEditingEraIndex(props.index)}>Edit</Button>) : null}
                {props.canAddNewEra ? (<Button variant="contained" disabled={!isEditable() || isEditing()} onClick={props.addNewEra}>Add New Era</Button>) : null}

            </CardActions>
        </Card>
    );
}

export default EraCard;
