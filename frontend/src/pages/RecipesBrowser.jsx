import {useState} from "react";
import {Grid, Grow, Skeleton, Typography, useTheme} from "@mui/material";
import Recipe from "../components/Recipe";
import RecipesFetcher from "../components/RecipesFetcher";
import Box from "@mui/material/Box";

const RecipesBrowser = () => {
    const theme = useTheme();
    const [recipes, setRecipes] = useState([]);
    const [skeletons, setSkeletons] = useState(Array.from(new Array(6)));
    const [isPending, setIsPending] = useState(true);

    return (
        <Box sx={{overflowAnchor: "none", width: "100%"}}>
            <Typography component="h1" fontWeight="medium" gutterBottom sx={{
                fontSize: {
                    xs: theme.typography.h4.fontSize,
                    sm: theme.typography.h3.fontSize,
                }
            }}>
                Przepisy
            </Typography>
            <RecipesFetcher {...{setRecipes, setSkeletons, isPending, setIsPending}} />
            <Grid container spacing={3} columns={{xs: 2, sm: 2, md: 8, lg: 8, xl: 12}} alignItems="stretch">
                {recipes.map(recipe => (
                    <Grow in timeout={400} key={recipe.id}>
                        <Grid item xs={2} sm={2} md={4} lg={4} xl={4}>
                            <Recipe key={recipe.id} {...recipe} />
                        </Grid>
                    </Grow>
                ))}
                {skeletons.map((_, index) => (
                    <Grid item xs={2} sm={2} md={4} lg={4} xl={4} key={index}>
                        <Skeleton variant="rectangular" height="100%" sx={{
                            mt: 2,
                            borderRadius: 8,
                            minHeight: 200,
                            width: '100%',
                            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                        }}/>
                    </Grid>
                ))}
            </Grid>
            {!isPending && recipes.length === 0 && (
                <Grow in timeout={500}>
                    <Typography mt={2} variant="h5" component="p">Brak przepisów spełniających kryteria</Typography>
                </Grow>
            )}
        </Box>
    );
};

export default RecipesBrowser;
