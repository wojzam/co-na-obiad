import React, {useEffect, useState} from "react";
import {Autocomplete, Box, TextField} from "@mui/material";
import SearchBar from "./SearchBar";
import IngredientFilterInput from "./IngredientFilterInput";
import axios from "axios";
import useAuthData from "../hooks/useAuthData";
import SortInput from "./SortInput";
import debounce from "../utils/debounce";
import {useCategories} from "../hooks/useCachedData.jsx";
import useSearchState from "../hooks/useSearchState.jsx";

const pageSize = 30;
const MAX_CATEGORIES = 10;

export default function RecipesFetcher({setRecipes, isPending, setIsPending, onlyUser = false, id = "/recipes"}) {
    const {userId} = useAuthData();
    const {
        filter,
        handleFilterChange,
        sort,
        handleSortChange,
        pages,
        setPages,
        isLastPage,
        setIsLastPage,
        resetRecipes,
        isReadingState
    } = useSearchState({id, setRecipes});
    const categories = useCategories();
    const [canFetch, setCanFetch] = useState(false);

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
        if (isReadingState) return;
        setCanFetch(true);
    }, [isReadingState]);

    useEffect(() => {
        if (isReadingState || !canFetch) return;
        fetchRecipes();
    }, [canFetch, filter, sort, pages]);

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
                <SearchBar initialQuery={filter.name} onFilterChange={handleFilterChange}/>
                <IngredientFilterInput initialIngredients={filter.include} onFilterChange={handleFilterChange}
                                       text={"Zawiera"}/>
                <IngredientFilterInput initialIngredients={filter.exclude} onFilterChange={handleFilterChange}
                                       text={"Nie zawiera"}/>
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
                    value={filter.categories}
                    options={categories.map(categories => categories.name)}
                    getOptionDisabled={() => (filter.categories.length >= MAX_CATEGORIES)}
                    filterSelectedOptions
                    onChange={(e, v) => handleFilterChange({categories: v})}
                    renderInput={(params) => <TextField {...params} label="Kategorie"/>}
                />
            </Box>
            <SortInput {...{sort, handleSortChange}} />
        </Box>
    );
}

