import { Grid } from "@mui/material";
import React, { useContext, useEffect, useState } from 'react';
import Era from "../../Models/era";
import AuthContext from "../../Store/AuthContext";
import EraCard from "./EraCard/EraCard";
import styles from "./Timeline.module.css";

const Timeline = () => {

    // Setup

    const authContext = useContext(AuthContext);
    const [eraList, setEraList] = useState<Era[]>([]);
    const [editingEraIndex, setEditingEraIndex] = useState<number>(-1);

    // Fetch

    useEffect(() => {
        let username = authContext.username!;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'authorization': authContext.token! },
            body: JSON.stringify({ username: username })
        };

        var uri = process.env.REACT_APP_BACKEND_URI + '/api/timeline/fetchTimeline'; // move to service

        fetch(uri, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setEraList(data.timeline.eras);
            });

    }, []);

    const saveTimeline = (era: Era) => {
        let newEraList = eraList.map((oldEra, idx) => {
            if (idx === editingEraIndex) {
                return era;
            } else {
                return oldEra;
            }
        });

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'authorization': authContext.token! },
            body: JSON.stringify({ eras: newEraList })
        };

        var uri = process.env.REACT_APP_BACKEND_URI + '/api/timeline/saveTimeline'; // move to service

        fetch(uri, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setEditingEraIndex(-1);
                    setEraList(newEraList);
                }
                else {
                    window.alert("Error saving timeline.");
                    console.log(data);
                }
            });
    }

    // TODO: refactor to common func
    const addNewEra = () => {
        var newEraList = [...eraList, new Era("New Era", "", ["List your entries here!"], "", "", "", false)];
        
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'authorization': authContext.token! },
            body: JSON.stringify({ eras: eraList })
        };

        var uri = process.env.REACT_APP_BACKEND_URI + '/api/timeline/saveTimeline'; // move to service

        fetch(uri, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setEraList(newEraList);
                }
                else {
                    window.alert("Error saving timeline.");
                    console.log(data);
                }
            });
    }

    return (
        <Grid container justifyContent="space-around">
            <Grid item>
                {eraList.map((era, idx) => (
                    <EraCard
                        era={era}
                        index={idx}
                        editingEraIndex={editingEraIndex}
                        setEditingEraIndex={setEditingEraIndex}
                        saveChanges={(era) => saveTimeline(era)}
                        canAddNewEra={idx === eraList.length - 1}
                        addNewEra={addNewEra}/>
                ))}                
            </Grid>
        </Grid>
    );
}

export default Timeline;
