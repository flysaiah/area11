import styles from './AddAnimeTool.module.css';
import Pane from '../../Pane/Pane';
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, useTheme } from '@mui/material';
import { useContext, useState } from 'react';
import CatalogCategory from '../CatalogCategory';
import AuthContext from '../../../Store/AuthContext';
import OperationResult from '../../../Models/operationresult';

type AddAnimeToolProps = {
    handleAddAnimeComplete: () => void;
    showToast: (message:string, isError:boolean) => void;
    preventCatalogActions: boolean;
}

const AddAnimeTool: React.FC<AddAnimeToolProps> = (props) => {

    const authContext = useContext(AuthContext);

    const theme = useTheme();
    const [category, setCategory] = useState<string>(CatalogCategory.WantToWatch);
    const [malUrl, setMalUrl] = useState<string>("");
    const [currentlyAddingAnime, setCurrentlyAddingAnime] = useState<boolean>(false);

    const handleCategoryChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value as string);
      };

    const handleUrlChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setMalUrl(event.target.value as string);
    };

    const addAnime = () => {

        if (currentlyAddingAnime) {
            return;
        }

        setCurrentlyAddingAnime(true);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'authorization': authContext.token! }, // TODO: refactor into service
            body: JSON.stringify({ malUrl: malUrl, category: category })
        };

        var uri = process.env.REACT_APP_BACKEND_URI + '/api/anime/addAnime'; // move to service

        fetch(uri, requestOptions)
            .then(response => response.json() as Promise<OperationResult>)
            .then(res => {
                if (!res?.success) {
                    console.log("Error adding anime: " + res.message + ". Data=" + res.data);
                    if (res.message.includes("Area11Error.Conflict")) {
                        props.showToast("Anime already exists in catalog.", true);
                    } else {
                        props.showToast("Error adding anime.", true);
                    }

                    if (res.message.includes("Area11Error.Auth")) {
                        authContext.logout();
                        return;
                    }
                }
                else {
                    props.showToast("Successfully added anime!", false);

                    setMalUrl("");                  
                    props.handleAddAnimeComplete();
                }

                setCurrentlyAddingAnime(false);
            });
    }

    return (
    <Pane className={styles.container}>
       <TextField label="MyAnimeList URL" variant="standard" value={malUrl} onChange={handleUrlChange} />
       <Button disabled={currentlyAddingAnime || props.preventCatalogActions} variant="contained" className={styles["add-button"]} style={{"backgroundColor": theme.palette.secondary.main}} onClick={addAnime}>Add</Button>
       <FormControl sx={{ m: 1, minWidth: 120 }} size="small" variant="standard" className={styles["category-select"]}>
        <InputLabel id="category-select-label">Add To</InputLabel>
            <Select
                labelId="category-select-label"
                id="category-select"
                value={category}
                label="Age"
                onChange={handleCategoryChange}
            >
                <MenuItem value={CatalogCategory.WantToWatch}>Want to Watch</MenuItem>
                <MenuItem value={CatalogCategory.Considering}>Considering</MenuItem>
                <MenuItem value={CatalogCategory.Completed}>Completed</MenuItem>
            </Select>
        </FormControl>
    </Pane>
        )
}

export default AddAnimeTool;
