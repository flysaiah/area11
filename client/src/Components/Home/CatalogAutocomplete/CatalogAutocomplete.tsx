import Anime from '../../../Models/anime';
import { Autocomplete, TextField } from "@mui/material";
import styles from './CatalogAutocomplete.module.css';

const CatalogAutocomplete = (props: {
    animeList:Anime[],
    setCurrentlySelected: React.Dispatch<React.SetStateAction<Anime | undefined>>
}) => {
    
    // Setup

    // JSX

    return (
        <div id="search-autocomplete">
            <Autocomplete
                disablePortal
                id="search-autocomplete"
                options={props.animeList}
                getOptionLabel={(anime:Anime) => anime.name}
                renderOption={(_, option:Anime) =>
                    (
                        <div className={styles["autocomplete-option"]} key={"autocomplete_option_" + option.name} onClick={() => props.setCurrentlySelected(option)}>
                            <img className={styles["autocomplete-option-thumbnail"]} src={option.thumbnail} alt="Thumbnail"/>
                            <span className={styles["autocomplete-option-text"]}>{option.name}</span>
                        </div>
                    )}
                sx={{ width: 200 }}
                ListboxProps={{
                    style: {
                        minHeight: "22px",
                        fontSize: "10px",
                        textShadow: "0px 0px 0px"
                    }
                }}
                renderInput={(params) => <TextField {...params} size="small" />}
            />
        </div>
    );
}

export default CatalogAutocomplete;
