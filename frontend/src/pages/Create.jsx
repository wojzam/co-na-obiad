import {useState} from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {RecipeForm} from "../components/RecipeForm.jsx";

export default function CreateRecipe() {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        // const data = new FormData(event.currentTarget);
        // const token = localStorage.getItem("token");
        //
        // fetch("/api/recipes", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         Authorization: `Bearer ${token}`,
        //     },
        //     body: JSON.stringify({
        //         title: data.get("title"),
        //         description: data.get("description"),
        //         publicVisibility: data.get("publicVisibility") === "public",
        //         category: selectedCategory,
        //     }),
        // })
        //     .then((response) => {
        //         if (!response.ok) {
        //             return response.text().then((text) => {
        //                 throw new Error(JSON.parse(text).title);
        //             });
        //         }
        //         return response.json();
        //     })
        //     .then((data) => {
        //         window.history.pushState({url: "/userRecipes"}, "", "/userRecipes");
        //         window.location.href = `/recipe/${data.id}`;
        //     })
        //     .catch((error) => {
        //         setErrorMessage(error.message);
        //     });
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h4" gutterBottom>
                    Dodaj przepis
                </Typography>
                {errorMessage && (
                    <Typography component="h5" variant="h5" color="error" gutterBottom>
                        {errorMessage}
                    </Typography>
                )}
                <RecipeForm
                    handleSubmit={handleSubmit}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                />
            </Box>
        </Container>
    );
}
