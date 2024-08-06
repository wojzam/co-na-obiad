import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

export const useRecipe = () => {
    const {id} = useParams();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        axios.get(`/api/recipes/${id}`, {})
            .then((response) => {
                setRecipe(response.data);
            })
            .catch(() => {
                setRecipe(null);
            });
    }, []);

    return recipe;
}