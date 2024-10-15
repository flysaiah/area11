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

    const [shuffleMap, setShuffleMap] = useState<Map<string, number>|null>(null);

    if (shuffleMap && shuffleMap.size > 0) {
        finalistList.sort((a, b) => {
            let aVal = shuffleMap.get(a.name);
            let bVal = shuffleMap.get(b.name);

            if (!aVal || !bVal) {
                return 0;
            }

            return aVal < bVal ? 1 : -1;
        })
    }

    const removeFinalist = (anime:Anime) => {
        anime.isFinalist = false;
        props.updateAnime(anime, "Successfully removed finalist!");
    }

    const shuffle = () => {
        let newMap = new Map<string, number>();

        for (let i = 0; i < props.animeList.length; i++) {
            newMap.set(props.animeList[i].name, Math.random());
        }

        setShuffleMap(newMap);
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
