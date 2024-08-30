import {useEffect, useState} from 'react';

const SESSION_STORAGE_KEY = 'searchState';
export const defaultFilter = {name: "", include: [], exclude: [], categories: []};
export const defaultSort = "name";

export const useSearchState = ({id, setRecipes}) => {
    const [filter, setFilter] = useState(defaultFilter);
    const [sort, setSort] = useState(defaultSort);
    const [pages, setPages] = useState(1);
    const [isLastPage, setIsLastPage] = useState(false);
    const [isReadingState, setIsReadingState] = useState(true);

    function resetSessionStorage() {
        save({filter: defaultFilter, sort: defaultSort});
    }

    useEffect(() => {
        read();
        setIsReadingState(false);
    }, [id]);

    const read = () => {
        const sessionState = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (sessionState) {
            const parsedState = JSON.parse(sessionState);
            const searchState = parsedState[id];
            if (searchState) {
                setFilter(searchState.filter);
                setSort(searchState.sort);
            } else {
                resetSessionStorage();
            }
        } else {
            resetSessionStorage();
        }
    };

    const save = (newState) => {
        const sessionState = sessionStorage.getItem(SESSION_STORAGE_KEY);
        const updatedSearchState = sessionState ? JSON.parse(sessionState) : {};
        updatedSearchState[id] = newState;
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedSearchState));
    };

    const resetRecipes = () => {
        setRecipes([]);
        setPages(1);
        setIsLastPage(false);
    };

    const handleFilterChange = (updatedFields) => {
        resetRecipes();
        setFilter((prevFilter) => {
            const newFilter = {...prevFilter, ...updatedFields};
            save({filter: newFilter, sort});
            return newFilter;
        });
    };

    const handleSortChange = (event) => {
        resetRecipes();
        const newSort = event.target.value;
        setSort(newSort);
        save({filter, sort: newSort});
    };

    return {
        filter,
        handleFilterChange,
        sort,
        handleSortChange,
        pages,
        setPages,
        isLastPage,
        setIsLastPage,
        resetRecipes,
        isReadingState,
        save
    };
};
