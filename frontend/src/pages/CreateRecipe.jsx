import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {RecipeForm} from "../components/RecipeForm.jsx";
import {useCookies} from "react-cookie";

export default function CreateRecipe() {
    const [cookies] = useCookies(["token"]);

    const onSubmit = (data) => {
        fetch("/api/recipes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.token}`,
            },
            body: JSON.stringify({
                name: data.name,
                comment: data.comment,
                category: data.category,
                ingredients: data.ingredients.filter((i) => i.name),
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((text) => {
                        throw new Error(JSON.parse(text).title);
                    });
                }
                return response.json();
            })
            .then((data) => {
                window.history.pushState({url: "/userRecipes"}, "", "/userRecipes");
                window.location.href = `/recipes/${data._id}`;
            })
            .catch((error) => {
                console.log(error.message);
            });
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center",}}>
                <Typography component="h1" variant="h4" gutterBottom>Nowy przepis</Typography>
                <RecipeForm onSubmit={onSubmit}/>
            </Box>
        </Container>
    );
}
