import {useState} from "react";
import {Box, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import SearchBar from "./SearchBar";
import IngredientFilterInput from "./IngredientFilterInput.jsx";

export default function RecipeListControls({setRecipes}) {
    const [sortValue, setSortValue] = useState("name");

    const handleSortChange = (event) => {
        setSortValue(event.target.value);
    };

    return (
        <Box
            display="flex"
            flex-direction="row"
            justifyContent="space-between"
            alignItems="end"
            width="100%"
            mb="2em"
        >
            <Box display="flex"
                 flex-direction="row" gap="1em">

            <SearchBar {...{setRecipes}} />
            <IngredientFilterInput/>
            <IngredientFilterInput/>
            </Box>
            <Box>
                <FormControl sx={{m: 1, minWidth: 120}}>
                    <InputLabel id="sort-label">Sortowanie</InputLabel>
                    <Select
                        labelId="sort-label"
                        id="sort-select"
                        value={sortValue}
                        label="Sortuj po"
                        onChange={handleSortChange}
                    >
                        <MenuItem value="name">Nazwa</MenuItem>
                        <MenuItem value="date">Data</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </Box>
    );
}
