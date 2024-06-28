import {useEffect, useState} from "react";
import {CircularProgress, Grid, Typography} from "@mui/material";
import Recipe from "../components/Recipe.jsx";
import RecipeListControls from "../components/RecipeListControls.jsx";

const RecipesBrowser = () => {
    const [recipes, setRecipes] = useState([]);
    const [isPending, setIsPending] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch("/api/recipes", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setRecipes(data);
                setIsPending(false);
            });
    }, []);

    return (
        <>
            <Typography component="h1" variant="h2" fontWeight="medium" gutterBottom> Przepisy </Typography>
            <RecipeListControls {...{setRecipes}} />
            {isPending && <CircularProgress/>}
            <Grid container spacing={{xs: 2, md: 3}} columns={{xs: 4, sm: 8, md: 12}} alignItems="stretch">
                {recipes && recipes.map((recipe, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                        <Recipe key={recipe._id} {...recipe} />
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default RecipesBrowser;
