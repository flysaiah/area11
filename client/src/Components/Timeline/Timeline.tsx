import { Fragment, useContext, useEffect, useState } from 'react';
import Era from "../../Models/era";
import AuthContext from "../../Store/AuthContext";
import EraCard from "./EraCard/EraCard";
import styles from "./Timeline.module.css";
import Header from "../Header/Header";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";

const Timeline = () => {

    // Setup

    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

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
                setEraList(data.timeline.eras);
            });

    }, [authContext]);

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
        <Fragment>
            <Header></Header>
            <Navbar>
                <div>
                    <button className={styles["back-to-home-button"]} onClick={() => navigate("/home")}>Back to Home</button>
                </div>
            </Navbar>
            <div className={styles.timeline}>
                {eraList.map((era, idx) => (
                    <div className={idx % 2 === 0 ? styles["container-left"] : styles["container-right"]} key={era.name}>
                        <EraCard
                            key={era.name}
                            era={era}
                            index={idx}
                            editingEraIndex={editingEraIndex}
                            setEditingEraIndex={setEditingEraIndex}
                            saveChanges={(era) => saveTimeline(era)}
                            canAddNewEra={idx === eraList.length - 1}
                            addNewEra={addNewEra}/>
                    </div>
                ))}
            </div>
        </Fragment>
    );
}

export default Timeline;
