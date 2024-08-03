import {useState} from "react";
import {CircularProgress, Grid, Grow, Typography} from "@mui/material";
import Recipe from "../components/Recipe.jsx";
import RecipesFilter from "../components/RecipesFilter.jsx";

const RecipesBrowser = () => {
    const [recipes, setRecipes] = useState([]);

    return (
        <>
            <Typography component="h1" variant="h2" fontWeight="medium" gutterBottom> Przepisy </Typography>
            <RecipesFilter {...{setRecipes}} />
            {recipes ? <Grid container spacing={3} columns={{sm: 2, md: 8, lg: 8, xl: 12}} alignItems="stretch">
                    {recipes && recipes.map((recipe, index) => (
                        <Grow in={recipes != null} timeout={500} key={index}>
                            <Grid item sm={2} md={4} lg={4} xl={4} key={index}>
                                <Recipe key={recipe._id} {...recipe} />
                            </Grid>
                        </Grow>
                    ))}
                </Grid> :
                <CircularProgress/>}
        </>
    );
};

export default RecipesBrowser;
