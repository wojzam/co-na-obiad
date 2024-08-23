import {useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';

const COOKIE_NAME = 'searchState';
export const defaultFilter = {name: "", include: [], exclude: [], categories: []};
export const defaultSort = "name";

export const useSearchState = ({id, setRecipes}) => {
    const [cookies, setCookie] = useCookies([COOKIE_NAME]);
    const [filter, setFilter] = useState(defaultFilter);
    const [sort, setSort] = useState(defaultSort);
    const [pages, setPages] = useState(1);
    const [isLastPage, setIsLastPage] = useState(false);
    const [isReadingState, setIsReadingState] = useState(true);

    function resetCookie() {
        save({filter: defaultFilter, sort: defaultSort});
    }

    useEffect(() => {
        if (switchedToRecipePageAndReturned()) {
            read();
        } else {
            resetCookie();
        }
        setIsReadingState(false);
    }, [id]);

    const read = () => {
        const searchState = cookies.searchState ? cookies.searchState[id] : null;
        if (searchState) {
            setFilter(searchState.filter);
            setSort(searchState.sort);
        } else {
            resetCookie();
        }
    };

    const save = (newState) => {
        const updatedSearchState = {
            ...cookies.searchState,
            [id]: newState,
        };
        setCookie(COOKIE_NAME, updatedSearchState, {path: '/'});
    };

    const resetRecipes = () => {
        setRecipes([]);
        setPages(1);
        setIsLastPage(false);
    };

    const handleFilterChange = (updatedFields) => {
        resetRecipes();
        setFilter((prevFilter) => {
            const newFilter = {
                ...prevFilter,
                ...updatedFields,
            };
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

    const switchedToRecipePageAndReturned = () => {
        // const lastPages = cookies.lastPages;
        // console.log(lastPages);
        // console.log(lastPages.at(-1));
        // console.log(lastPages.at(-1).startsWith("/recipes/"));
        // return lastPages && lastPages.length >= 1 && lastPages.at(-1).startsWith("/recipes/");
        return true; // TODO this should be better
    }

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
