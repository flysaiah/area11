import Anime from '../../../Models/anime';
import { Autocomplete, TextField } from "@mui/material";

const CatalogAutocomplete = (props: { animeList:Anime[] }) => {

    // Setup

    return (
        <div id="search-autocomplete">
            <Autocomplete
                disablePortal
                id="search-autocomplete"
                options={props.animeList}
                getOptionLabel={(anime:Anime) => anime.name}
                renderOption={(props, option:Anime) =>
                    (
                        <div key={"autocomplete_option_" + option.name}>
                            <li>
                                {option.name}
                            </li>
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
