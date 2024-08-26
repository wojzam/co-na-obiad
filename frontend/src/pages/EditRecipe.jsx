import {useParams} from "react-router-dom";
import {useState} from "react";
import {Box, CircularProgress, Container, Typography, useTheme} from "@mui/material";
import {RecipeForm} from "../components/forms/RecipeForm";
import BackButton from "../components/BackButton";
import {useRecipe} from "../hooks/useRecipe";
import MessageBox from "../components/MessageBox";
import useAuthAxios from "../hooks/useAuthAxios";

export default function EditRecipe() {
    const {id} = useParams();
    const theme = useTheme();
    const axiosInstance = useAuthAxios();
    const recipe = useRecipe();
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = (data) => {
        setErrorMessage("");

        axiosInstance.put(`/api/recipes/${id}`, data, {
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then(() => {
                window.location.href = `/user-recipes`;
            })
            .catch(() => {
                setErrorMessage("Wystąpił nieoczekiwany błąd");
            });
    }

    const onDelete = () => {
        setErrorMessage("");

        axiosInstance.delete(`/api/recipes/${id}`)
            .then(() => {
                window.history.pushState({url: "/user-recipes"}, "", "/user-recipes");
                window.location.href = "/user-recipes";
            })
            .catch(() => {
                setErrorMessage("Wystąpił nieoczekiwany błąd");
            });
    }

    return (
        <>
            <BackButton/>
            <Container component="main" maxWidth="xs">
                <Box sx={{display: "flex", flexDirection: "column", alignItems: "center",}}>
                    <Typography component="h1" gutterBottom sx={{
                        fontSize: {
                            xs: theme.typography.h5.fontSize,
                            sm: theme.typography.h4.fontSize,
                        }
                    }}>
                        Edytuj przepis
                    </Typography>
                    <MessageBox message={errorMessage} isError={true}/>
                    {recipe ?
                        <RecipeForm onSubmit={onSubmit} onDelete={onDelete} isEdit={true} initialData={{
                            name: recipe.name,
                            categories: recipe.categories.map(c => c.name),
                            preparation: recipe.preparation,
                            ingredientSections: recipe.ingredientSections
                        }}/> : <CircularProgress/>}
                </Box>
            </Container></>
    );
}
