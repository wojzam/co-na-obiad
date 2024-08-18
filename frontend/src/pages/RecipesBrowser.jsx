import {useState} from "react";
import {Box, CircularProgress, Grid, Grow, Typography} from "@mui/material";
import Recipe from "../components/Recipe";
import RecipesFetcher from "../components/RecipesFetcher";

const RecipesBrowser = () => {
    const [recipes, setRecipes] = useState([]);
    const [isPending, setIsPending] = useState(true);

    return (
        <>
            <Typography component="h1" variant="h3" fontWeight="medium" gutterBottom> Przepisy </Typography>
            <RecipesFetcher {...{setRecipes, isPending, setIsPending}}/>
            {recipes && <Grid container spacing={3} columns={{sm: 2, md: 8, lg: 8, xl: 12}} alignItems="stretch">
                {recipes.map(recipe => (
                    <Grow in timeout={400} key={recipe.id}>
                        <Grid item sm={2} md={4} lg={4} xl={4} width="100%">
                            <Recipe key={recipe.id} {...recipe} />
                        </Grid>
                    </Grow>
                ))}
            </Grid>}
            {isPending ?
                <Box display="flex" justifyContent="center" width="100%" mt={7}>
                    <CircularProgress size={100}/>
                </Box> : recipes && recipes.length === 0 &&
                <Grow in timeout={500}>
                    <Typography mt={2} variant="h5" component="p">Brak wyników</Typography>
                </Grow>}
        </>
    );
};

export default RecipesBrowser;
