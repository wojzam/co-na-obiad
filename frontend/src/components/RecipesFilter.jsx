import {useEffect, useState} from "react";
import {Box, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import SearchBar from "./SearchBar";
import IngredientFilterInput from "./IngredientFilterInput";
import axios from "axios";
import useAuthData from "../hooks/useAuthData";

export default function RecipesFilter({setRecipes, onlyUser = false}) {
    const {userId} = useAuthData();
    const [filter, setFilter] = useState({
        name: "",
        include: [],
        exclude: []
    });
    const [sort, setSort] = useState("name");

    const handleFilterChange = (newFilter) => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            ...newFilter
        }));
    };

    const handleSortChange = (event) => {
        setSort(event.target.value);
    }

    useEffect(() => {
        let endpoint =
            `/api/recipes?name=${filter.name}&include=${filter.include}&exclude=${filter.exclude}&sort=${sort}`;

        if (onlyUser && userId) endpoint = endpoint + `&creatorId=${userId}`;

        axios.get(endpoint)
            .then((response) => {
                setRecipes(response.data);
            });
    }, [filter, sort]);

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

                <SearchBar filter={filter} onFilterChange={handleFilterChange}/>
                <IngredientFilterInput onFilterChange={handleFilterChange} text={"Zawiera"}/>
                <IngredientFilterInput onFilterChange={handleFilterChange} text={"Nie zawiera"}/>
            </Box>
            <Box>
                <FormControl sx={{m: 1, minWidth: 120}}>
                    <InputLabel id="sort-label">Sortowanie</InputLabel>
                    <Select
                        labelId="sort-label"
                        id="sort-select"
                        value={sort}
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
