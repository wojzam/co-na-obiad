import {useEffect, useState} from "react";
import {CircularProgress, Grid, Grow, Typography} from "@mui/material";
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
                setRecipes(data);
                setIsPending(false);
            });
    }, []);

    return (
        <>
            <Typography component="h1" variant="h2" fontWeight="medium" gutterBottom> Przepisy </Typography>
            <RecipeListControls {...{setRecipes}} />
            {isPending && <CircularProgress/>}
            <Grid container spacing={3} columns={{sm: 2, md: 8, lg: 8, xl: 12}} alignItems="stretch">
                {recipes && recipes.map((recipe, index) => (
                    <Grow in={!isPending} timeout={500} key={index}>
                        <Grid item sm={2} md={4} lg={4} xl={4} key={index}>
                            <Recipe key={recipe._id} {...recipe} />
                        </Grid>
                    </Grow>
                ))}
            </Grid>
        </>
    );
};

export default RecipesBrowser;
