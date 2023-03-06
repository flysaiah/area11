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
    const [editingInProgress, setIsEditing] = useState<boolean>(false);

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

    return (
        <Grid container justifyContent="space-around">
            <Grid item>
                {eraList.map(era => (
                    <EraCard era={era} />
                ))}                
            </Grid>
        </Grid>
    );
}

export default Timeline;
