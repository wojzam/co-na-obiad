import React, {useEffect, useRef, useState} from "react";
import {Autocomplete, Box, TextField} from "@mui/material";
import axios from "axios";
import SearchBar from "./SearchBar";
import SortInput from "./SortInput";
import IngredientFilterInput from "./IngredientFilterInput";
import MessageBox from "./MessageBox";
import useAuthData from "../hooks/useAuthData";
import debounce from "../utils/debounce";
import {useCategories} from "../hooks/useCachedData";
import {useSearchState} from "../hooks/useSearchState";
import {usePagingState} from "../hooks/usePagingState";

const PAGE_SIZE = 100; // TODO: improve infinite scroll then lower this value
const MAX_CATEGORIES = 10;
const TYPE_ALL = "all";
export const TYPE_USER = "user";
export const TYPE_SAVED = "savedBy";

export default function RecipesFetcher({
                                           setRecipes,
                                           setSkeletons,
                                           isPending,
                                           setIsPending,
                                           type = TYPE_ALL,
                                           id = "/recipes"
                                       }) {
    const {userId} = useAuthData();
    const categories = useCategories();

    const resetRecipes = () => {
        setRecipes([]);
        setPagesToLoad(1);
        setCurrentPage(1);
        setIsLastPage(false);
    };

    const {filter, handleFilterChange, sort, handleSortChange, isReadingState} = useSearchState({id, resetRecipes});
    const [scroll, setScroll] = useState(0);
    const {pagesToLoad, setPagesToLoad, isLastPage, setIsLastPage,} = usePagingState({id, scroll});
    const [canFetch, setCanFetch] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const isFetching = useRef(false);

    const generateEndpoint = () => {
        let endpoint = `/api/recipes?name=${filter.name}` +
            filter.include.map(i => `&include[]=${i}`).join("") +
            filter.exclude.map(i => `&exclude[]=${i}`).join("") +
            filter.categories.map(i => `&categories[]=${i}`).join("") +
            `&sort=${sort}` +
            `&page=${currentPage}` +
            `&pageSize=${PAGE_SIZE}`;
        if (userId) {
            if (type === TYPE_USER) endpoint = endpoint + `&creatorId=${userId}`;
            if (type === TYPE_SAVED) endpoint = endpoint + `&savedBy=${userId}`;
        }
        return endpoint;
    }

    const fetchRecipes = () => {
        setErrorMessage("");
        if (isLastPage || isFetching.current) return;
        isFetching.current = true;

        setIsPending(true);
        setSkeletons(Array.from(new Array(6)));

        axios.get(generateEndpoint())
            .then((response) => {
                if (currentPage === 1) setRecipes(response.data);
                else setRecipes((prevRecipes) => [...prevRecipes, ...response.data]);
                if (response.data.length === 0 || response.data.length !== PAGE_SIZE) {
                    if (response.data.length === 0) setPagesToLoad(prev => prev - 1);
                    setIsLastPage(true);
                    setSkeletons([]);
                } else if (currentPage < pagesToLoad) {
                    setCurrentPage((prevPage) => prevPage + 1);
                    fetchRecipes();
                }
            }).catch(() => {
            setErrorMessage("Brak połączenia z serwerem");
            resetRecipes();
        }).finally(() => {
            setIsPending(false);
            isFetching.current = false;
        });
    };

    useEffect(() => {
        if (isReadingState) return;
        setCanFetch(true);
    }, [isReadingState]);

    useEffect(() => {
        if (isReadingState || !canFetch) return;
        fetchRecipes();
    }, [canFetch, filter, sort, pagesToLoad]);

    const reachedBottom = (threshold = 1500) => {
        return document.body.scrollHeight <= window.scrollY + window.innerHeight + threshold;
    }

    const shouldLoadNextPage = () => {
        return (reachedBottom() && !isPending && !isLastPage);
    }

    const addNextPage = () => {
        setPagesToLoad((prevPages) => prevPages + 1);
    }

    useEffect(() => {
        const debouncedOnScroll = debounce(() => {
            setScroll(window.scrollY);
            if (shouldLoadNextPage()) addNextPage();
        }, 100);
        window.addEventListener("scroll", debouncedOnScroll);

        return () => {
            window.removeEventListener("scroll", debouncedOnScroll);
        };
    }, [isPending, isLastPage]);

    return (
        <>
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
                        limitTags={3}
                        filterSelectedOptions
                        onChange={(e, v) => handleFilterChange({categories: v})}
                        renderInput={(params) => <TextField
                            {...params}
                            label="Kategorie"
                            placeholder={filter.categories.length > 0 ? "" : "Zacznij pisać..."}
                        />}
                    />
                </Box>
                <SortInput {...{sort, handleSortChange}} />
            </Box>
            <MessageBox message={errorMessage} isError={true}/>
        </>
    );
}

