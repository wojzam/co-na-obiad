import {useState} from "react";
import {CircularProgress, Grid, Grow, Typography} from "@mui/material";
import Recipe from "../components/Recipe";
import RecipesFilter from "../components/RecipesFilter";

const RecipesBrowser = () => {
    const [recipes, setRecipes] = useState([]);
    const [isPending, setIsPending] = useState(true);

    return (
        <>
            <Typography component="h1" variant="h3" fontWeight="medium" gutterBottom> Przepisy </Typography>
            <RecipesFilter {...{setRecipes, setIsPending}} />
            {isPending ? <CircularProgress/> :
                recipes.length > 0 ? (
                        <Grid container spacing={3} columns={{sm: 2, md: 8, lg: 8, xl: 12}} alignItems="stretch">
                            {recipes && recipes.map((recipe, index) => (
                                <Grow in={recipes != null} timeout={500} key={index}>
                                    <Grid item sm={2} md={4} lg={4} xl={4} key={index} width="100%">
                                        <Recipe key={recipe._id} {...recipe} />
                                    </Grid>
                                </Grow>
                            ))}
                        </Grid>)
                    : <Typography variant="h6" component="p">Brak wyników</Typography>
            }
        </>
    );
};

export default RecipesBrowser;
