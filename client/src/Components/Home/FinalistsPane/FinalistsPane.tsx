import CircularProgress from '@mui/material/CircularProgress';
import Pane from '../../Pane/Pane';
import Anime from '../../../Models/anime';
import { Chip, Stack } from '@mui/material';
import styles from './FinalistsPane.module.css';
import { useState } from 'react';

type FinalistsPaneProps = {
    isLoading: boolean;
    animeList: Anime[];
    setCurrentlySelected: (anime:Anime|undefined) => void;
    updateAnime: (anime: Anime|undefined, toastMessage: string) => void;
}

const FinalistsPane: React.FC<FinalistsPaneProps> = (props) => {

    let finalistList:Anime[] = props.animeList.filter(v => {
        return v.isFinalist === true;
    });

    const [isShuffled, setIsShuffled] = useState<number>(0);

    if (isShuffled !== 0) {
        for (var i = finalistList.length - 1; i >= 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = finalistList[i];
            finalistList[i] = finalistList[j];
            finalistList[j] = temp;
        }
    }

    const removeFinalist = (anime:Anime) => {
        anime.isFinalist = false;
        props.updateAnime(anime, "Successfully removed finalist!");
    }

    const shuffle = () => {
        setIsShuffled(Math.random());
    }

    if (props.isLoading) {
        return (
            <Pane>
                <p>Loading finalist information...</p>
                <CircularProgress />
            </Pane>
        )
    }

    if (finalistList.length < 1) {
        return (
            <Pane>
                <div className={styles["default-message"]}>Anime you add to your final selection process will appear here!</div>
            </Pane>
        )
    }

    var finalistListLength = finalistList.length;

    return (
        <Pane>
            <div className={styles["finalist-top-container"]}>
                <p>Finalists: {finalistListLength}</p>
                <Stack justifyContent="center" className={styles["chip-container"]} direction="row" spacing={1}>
                    <Chip style={{"width": "100px"}} size="small" label="Show Stats" color="info" disabled></Chip>
                    <Chip style={{"width": "100px"}} size="small" label="Reshuffle" color="primary" onClick={shuffle}></Chip>
                </Stack>
            </div>
            {finalistList.map((anime, idx) => (
                <div key={anime.name} className={idx < finalistListLength - 1 ? styles["finalist-container"] : styles["finalist-container-final"]}>
                    <span className={styles["finalist-title"]}>{anime.name}</span>
                    <Stack className={styles["chip-container"]} direction="row-reverse" spacing={1}>
                        <Chip style={{"width": "80px"}} size="small" label="Remove" color="warning" onClick={() => removeFinalist(anime)}></Chip>
                        <Chip style={{"width": "80px"}} size="small" label="View" color="primary" onClick={() => props.setCurrentlySelected(anime)}></Chip>
                    </Stack>
                </div>
            ))}
        </Pane>
    )
}

export default FinalistsPane;
