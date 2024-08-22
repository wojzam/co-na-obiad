import React, {useEffect, useState} from "react";
import {Autocomplete, Box, TextField} from "@mui/material";
import SearchBar from "./SearchBar";
import IngredientFilterInput from "./IngredientFilterInput";
import axios from "axios";
import useAuthData from "../hooks/useAuthData";
import SortInput from "./SortInput";
import debounce from "../utils/debounce";
import {useCategories} from "../hooks/useCachedData.jsx";

const pageSize = 30;
const MAX_CATEGORIES = 10;

export default function RecipesFetcher({setRecipes, isPending, setIsPending, onlyUser = false}) {
    const {userId} = useAuthData();
    const [filter, setFilter] = useState({name: "", include: [], exclude: [], categories: []});
    const [sort, setSort] = useState("name");
    const categories = useCategories();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [pages, setPages] = useState(1);
    const [isLastPage, setIsLastPage] = useState(false);

    const resetRecipes = () => {
        setRecipes([]);
        setPages(1);
        setIsLastPage(false);
    }

    const handleFilterChange = (newFilter) => {
        resetRecipes();
        setFilter((prevFilter) => ({
            ...prevFilter,
            ...newFilter
        }));
    };

    const handleSortChange = (event) => {
        resetRecipes();
        setSort(event.target.value);
    }

    const handleCategoriesChange = (newCategories) => {
        setSelectedCategories(newCategories);
        handleFilterChange({categories: newCategories});
    };

    const generateEndpoint = () => {
        let endpoint = `/api/recipes?name=${filter.name}` +
            filter.include.map(i => `&include[]=${i}`).join("") +
            filter.exclude.map(i => `&exclude[]=${i}`).join("") +
            filter.categories.map(i => `&categories[]=${i}`).join("") +
            `&sort=${sort}` +
            `&page=${pages}` +
            `&pageSize=${pageSize}`;
        if (onlyUser && userId) endpoint = endpoint + `&creatorId=${userId}`;
        return endpoint;
    }

    const fetchRecipes = () => {
        setIsPending(true);

        axios.get(generateEndpoint())
            .then((response) => {
                if (response.data.length === 0 || response.data.length !== pageSize) {
                    setIsLastPage(true);
                }
                if (pages === 1) setRecipes(response.data);
                else setRecipes((prevRecipes) => [...prevRecipes, ...response.data]);

            }).catch(() => {
            resetRecipes();
        }).finally(() => {
            setIsPending(false);
        });
    };

    useEffect(() => {
        fetchRecipes();
    }, [filter, sort, pages]);

    const reachedBottom = (threshold = 100) => {
        return document.body.scrollHeight <= window.scrollY + window.innerHeight + threshold;
    }

    const shouldLoadNextPage = () => {
        return (reachedBottom() && !isPending && !isLastPage);
    }

    const addNextPage = () => {
        setPages((prevPages) => prevPages + 1);
    }

    useEffect(() => {
        if (shouldLoadNextPage()) addNextPage();
        else {
            const debouncedOnScroll = debounce(() => {
                if (shouldLoadNextPage()) addNextPage();
            }, 100);
            window.addEventListener("scroll", debouncedOnScroll);

            return () => {
                window.removeEventListener("scroll", debouncedOnScroll);
            };
        }
    }, [isPending, isLastPage]);

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
                <Autocomplete
                    sx={{
                        p: "2px 4px",
                        display: "flex",
                        alignItems: "center",
                        height: 50,
                        width: "auto",
                        minWidth: 200
                    }}
                    multiple
                    disablePortal
                    value={selectedCategories}
                    options={categories.map(categories => categories.name)}
                    getOptionDisabled={() => (selectedCategories.length >= MAX_CATEGORIES)}
                    filterSelectedOptions
                    onChange={(e, v) => handleCategoriesChange(v)}
                    renderInput={(params) => <TextField {...params} label="Kategorie"/>}
                />
            </Box>
            <SortInput  {...{sort, handleSortChange}}/>
        </Box>
    );
}
