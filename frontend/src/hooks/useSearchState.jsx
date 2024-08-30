import {useEffect, useState} from 'react';

const SEARCH_KEY = 'searchState';
export const defaultFilter = {name: "", include: [], exclude: [], categories: []};
export const defaultSort = "name";

export const useSearchState = ({id, resetRecipes}) => {
    const [filter, setFilter] = useState(defaultFilter);
    const [sort, setSort] = useState(defaultSort);
    const [isReadingState, setIsReadingState] = useState(true);

    function resetSessionStorage() {
        save({filter: defaultFilter, sort: defaultSort});
    }

    useEffect(() => {
        read();
        setIsReadingState(false);
    }, [id]);

    const read = () => {
        const sessionState = sessionStorage.getItem(SEARCH_KEY);
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
        const sessionState = sessionStorage.getItem(SEARCH_KEY);
        const updatedSearchState = sessionState ? JSON.parse(sessionState) : {};
        updatedSearchState[id] = newState;
        sessionStorage.setItem(SEARCH_KEY, JSON.stringify(updatedSearchState));
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
        resetRecipes,
        isReadingState,
        save
    };
};
