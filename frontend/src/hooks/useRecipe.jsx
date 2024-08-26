import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import useAuthAxios from "./useAuthAxios.jsx";
import useAuthData from "./useAuthData.jsx";

export const useRecipe = () => {
    const {id} = useParams();
    const [recipe, setRecipe] = useState(null);
    const {token} = useAuthData();
    const axiosInstance = useAuthAxios();

    const isAuthenticated = token !== undefined;
    const usedAxios = isAuthenticated ? axiosInstance : axios;

    useEffect(() => {
        usedAxios.get(`/api/recipes/${id}`, {})
            .then((response) => {
                setRecipe(response.data);
            })
            .catch(() => {
                setRecipe(null);
            });
    }, []);

    return recipe;
}