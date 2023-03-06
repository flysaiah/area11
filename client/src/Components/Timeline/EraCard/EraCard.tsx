import { Card, CardContent } from "@mui/material";
import React from 'react';
import Era from "../../../Models/era";
import styles from './EraCard.module.css';

const EraCard:React.FC<{ era:Era }> = (props) => {

    var era = props.era;

    return (
        <Card variant="outlined" className={styles["card"]}>
            <CardContent>
                <div className={styles["era-header"]}>
                    <h1 className={styles["era-title"]}>{era.name}</h1>
                    <p><i>{era.subHeader}</i></p>
                </div>
                <hr/>
                <div>
                    {era.entries.map(entry => (
                        <p className={styles["entry"]}>{entry}</p>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default EraCard;
