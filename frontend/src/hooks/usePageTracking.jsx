import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useCookies} from 'react-cookie';

export const PAGES_COOKIE_NAME = "lastPages";
const MAX_PAGES = 3;

export default function usePageTracking() {
    const location = useLocation();
    const [cookies, setCookie] = useCookies([PAGES_COOKIE_NAME]);
    const [lastPages, setLastPages] = useState(() => {
        const cookieValue = cookies.lastPages;
        return cookieValue ? cookieValue : [];
    });

    useEffect(() => {
        const pagesArray = [...lastPages, location.pathname];

        if (pagesArray.length > MAX_PAGES) {
            pagesArray.shift();
        }

        setLastPages(pagesArray);
        setCookie(PAGES_COOKIE_NAME, pagesArray, {path: '/'});
    }, [location]);
}