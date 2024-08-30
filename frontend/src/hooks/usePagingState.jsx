import {useEffect, useState} from 'react';

const STORAGE_KEY = 'pagingState';

export const usePagingState = ({id, scroll}) => {
    const [pagesToLoad, setPagesToLoad] = useState(1);
    const [isLastPage, setIsLastPage] = useState(false);
    const [isReadingState, setIsReadingState] = useState(true);

    function resetSessionStorage() {
        save({scroll: 0, page: 1, isLastPage: false});
    }

    useEffect(() => {
        const navigationEntries = performance.getEntriesByType("navigation");
        if (navigationEntries.length > 0 && navigationEntries[0].type === "back_forward") read();
        setIsReadingState(false);
    }, [id]);

    useEffect(() => {
        if (isReadingState) return;
        save({scroll: scroll, page: pagesToLoad, isLastPage: setIsLastPage});
    }, [scroll, isReadingState]);

    const read = () => {
        const sessionState = sessionStorage.getItem(STORAGE_KEY);
        if (sessionState) {
            const parsedState = JSON.parse(sessionState);
            const paginationState = parsedState[id];
            if (paginationState) {
                setPagesToLoad(paginationState.page);
                setIsLastPage(paginationState.isLastPage);
                updateScroll(paginationState.scroll);
            } else {
                resetSessionStorage();
            }
        } else {
            resetSessionStorage();
        }
    };

    const save = (newState) => {
        const sessionState = sessionStorage.getItem(STORAGE_KEY);
        const updatedPaginationState = sessionState ? JSON.parse(sessionState) : {};
        updatedPaginationState[id] = newState;
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPaginationState));
    };

    const updateScroll = (newScroll) => {
        setTimeout(() => {
            window.scrollTo({top: newScroll, behavior: "instant"});
        }, 400);
    }

    return {
        pagesToLoad,
        setPagesToLoad,
        isLastPage,
        setIsLastPage,
    };
};
