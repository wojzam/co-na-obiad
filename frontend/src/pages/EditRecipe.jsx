import {Box, CircularProgress, Container, Typography} from "@mui/material";
import {RecipeForm} from "../components/RecipeForm";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import BackButton from "../components/BackButton";
import axios from "axios";
import useAuthData from "../hooks/useAuthData";

export default function EditRecipe() {
    const {token} = useAuthData();
    const {id} = useParams();
    const [recipe, setRecipe] = useState();

    useEffect(() => {
        fetch(`/api/recipes/${id}`, {})
            .then((response) => response.json())
            .then((data) => {
                setRecipe(data);
            });
    }, []);

    const onSubmit = (data) => {
        axios.put(`/api/recipes/${id}`, {
            name: data.name,
            comment: data.comment,
            category: data.category,
            ingredients: data.ingredients.filter((i) => i.name)
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then(() => {
                window.location.href = `/user-recipes`;
            })
            .catch((error) => {
                console.log(error.message);
            });
    }

    const onDelete = () => {
        axios.delete(`/api/recipes/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(response => {
                window.history.pushState({url: "/user-recipes"}, "", "/user-recipes");
                window.location.href = "/user-recipes";
            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <>
            <BackButton/>
            <Container component="main" maxWidth="xs">
                <Box sx={{display: "flex", flexDirection: "column", alignItems: "center",}}>
                    <Typography component="h1" variant="h4" gutterBottom>Edytuj przepis</Typography>
                    {recipe ?
                        <RecipeForm onSubmit={onSubmit} onDelete={onDelete} isEdit={true} initialData={{
                            name: recipe.name,
                            category: recipe.category.name,
                            comment: recipe.comment,
                            ingredients: recipe.ingredientSections[0].ingredients.map(i => ({
                                name: i?.name || "",
                                value: i?.value || "",
                                unit: i?.unit || null
                            }))
                        }}/> : <CircularProgress/>}
                </Box>
            </Container></>
    );
}
