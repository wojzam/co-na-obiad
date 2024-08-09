import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {RecipeForm} from "../components/RecipeForm";
import MessageBox from "../components/MessageBox.jsx";
import {useState} from "react";
import useAuthAxios from "../hooks/useAuthAxios.jsx";

export default function CreateRecipe() {
    const axiosInstance = useAuthAxios();
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = (data) => {
        setErrorMessage("");

        axiosInstance.post("/api/recipes", data, {
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then((response) => {
                window.history.pushState({url: "/user-recipes"}, "", "/user-recipes");
                window.location.href = `/recipes/${response.data._id}`;
            })
            .catch(() => {
                setErrorMessage("Wystąpił nieoczekiwany błąd");
            });
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center",}}>
                <Typography component="h1" variant="h4" gutterBottom>Nowy przepis</Typography>
                <MessageBox message={errorMessage} isError={true}/>
                <RecipeForm onSubmit={onSubmit}/>
            </Box>
        </Container>
    );
}
