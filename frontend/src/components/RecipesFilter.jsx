import {useEffect, useState} from "react";
import {Box} from "@mui/material";
import SearchBar from "./SearchBar";
import IngredientFilterInput from "./IngredientFilterInput";
import axios from "axios";
import useAuthData from "../hooks/useAuthData";
import SortInput from "./SortInput";

export default function RecipesFilter({setRecipes, setIsPending, onlyUser = false}) {
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

    useEffect(() => {
        setIsPending(true);

        let endpoint = `/api/recipes?name=${filter.name}` +
            filter.include.map(i => `&include[]=${i}`).join("") +
            filter.exclude.map(i => `&exclude[]=${i}`).join("") +
            `&sort=${sort}`;
        if (onlyUser && userId) endpoint = endpoint + `&creatorId=${userId}`;

        axios.get(endpoint)
            .then((response) => {
                setRecipes(response.data);
                setIsPending(false);
            }).catch((error) => {
            setRecipes([]);
            setIsPending(false);
        });
    }, [filter, sort]);

    return (
        <Box
            display="flex"
            flexDirection={{xs: "column", sm: "column", md: "row"}}
            justifyContent="space-between"
            alignItems="flex-start"
            width="100%"
            mb="2em"
            gap="1em"
        >
            <Box
                display="flex"
                flexDirection={{xs: "column", sm: "column", md: "row"}}
                gap="1em"
                width="100%"
            >
                <SearchBar filter={filter} onFilterChange={handleFilterChange}/>
                <IngredientFilterInput onFilterChange={handleFilterChange} text={"Zawiera"}/>
                <IngredientFilterInput onFilterChange={handleFilterChange} text={"Nie zawiera"}/>
            </Box>
            <SortInput sort={sort} setSort={setSort}/>
        </Box>
    );
}
