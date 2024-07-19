import {useEffect, useState} from "react";
import axios from "axios";

const useCachedData = (name) => {
    const [data, setData] = useState([]);

    function expirationDate() {
        const oneHourFromNow = new Date();
        oneHourFromNow.setTime(oneHourFromNow.getTime() + (60 * 60 * 1000));
        return oneHourFromNow;
    }

    useEffect(() => {
        const cachedData = localStorage.getItem(name);
        const cachedExpiration = localStorage.getItem(`${name}Expiration`);

        if (cachedData && cachedExpiration) {
            const expiration = new Date(cachedExpiration);

            if (new Date() < expiration) {
                setData(JSON.parse(cachedData));
                return;
            }
        }

        axios.get(`/api/recipes/${name}`)
            .then((response) => {
                localStorage.setItem(name, JSON.stringify(response.data));
                localStorage.setItem(`${name}Expiration`, expirationDate().toISOString());
                setData(response.data);
            });
    }, [name]);

    return data;
};

export const useCategories = () => {
    return useCachedData("categories");
};

export const useIngredients = () => {
    return useCachedData("ingredients");
};

export const useUnits = () => {
    return useCachedData("units");
};
