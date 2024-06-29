import {useEffect, useState} from "react";
import {Box, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import SearchBar from "./SearchBar";
import IngredientFilterInput from "./IngredientFilterInput.jsx";

export default function RecipeListControls({setRecipes}) {
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
        const endpoint =
            `/api/recipes?name=${filter.name}&include=${filter.include}&exclude=${filter.exclude}&sort=${sort}`;
        const token = localStorage.getItem("token");

        fetch(endpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setRecipes(data);
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
                <IngredientFilterInput filter={filter} onFilterChange={handleFilterChange} text={"Zawiera"}/>
                <IngredientFilterInput filter={filter} onFilterChange={handleFilterChange} text={"Nie zawiera"}/>
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
