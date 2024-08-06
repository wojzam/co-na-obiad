import {Box, CircularProgress, Container, Typography} from "@mui/material";
import {RecipeForm} from "../components/RecipeForm";
import {useParams} from "react-router-dom";
import {useState} from "react";
import BackButton from "../components/BackButton";
import {useRecipe} from "../hooks/useRecipe.jsx";
import MessageBox from "../components/MessageBox.jsx";
import useAuthAxios from "../hooks/useAuthAxios.jsx";

export default function EditRecipe() {
    const {id} = useParams();
    const axiosInstance = useAuthAxios();
    const recipe = useRecipe();
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = (data) => {
        setErrorMessage("");

        axiosInstance.put(`/api/recipes/${id}`, {
            name: data.name,
            comment: data.comment,
            category: data.category,
            ingredients: data.ingredients.filter((i) => i.name)
        }, {
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
                    <Typography component="h1" variant="h4" gutterBottom>Edytuj przepis</Typography>
                    <MessageBox message={errorMessage} isError={true}/>
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
