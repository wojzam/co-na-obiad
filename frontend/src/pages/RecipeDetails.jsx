import {Box, Divider, Grid, Skeleton, Typography, useTheme} from "@mui/material";
import BackButton from "../components/BackButton";
import {useRecipe} from "../hooks/useRecipe";
import IngredientList from "../components/IngredientList.jsx";

const RecipeDetails = () => {
    const recipe = useRecipe();
    const theme = useTheme();

    return (
        <>
            <BackButton/>
            <Box my="2em" width="100%">
                <Box mb={2}>
                    <Box display="flex" gap={1} flexWrap="wrap"
                         sx={{justifyContent: {xs: "center", sm: 'center', md: 'left'}}}>
                        {recipe ? recipe?.categories.map(category => (
                                <Typography key={category._id} fontWeight="regular" gutterBottom sx={{
                                    display: 'inline-block',
                                    backgroundColor: theme.palette.lightGrey.main,
                                    borderRadius: "5px",
                                    px: 1.5,
                                    whiteSpace: "nowrap",
                                    fontSize: {
                                        xs: theme.typography.subtitle2.fontSize,
                                        lg: theme.typography.subtitle1.fontSize,
                                    },
                                }}>
                                    {category.name}
                                </Typography>
                            ))
                            : <Skeleton width={100}/>}
                    </Box>
                    <Typography sx={{
                        fontSize: {
                            xs: theme.typography.h4.fontSize,
                            sm: theme.typography.h3.fontSize,
                        },
                        textAlign: {
                            xs: 'center',
                            sm: 'center',
                            md: 'left',
                        },
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                    }} fontWeight="medium">
                        {recipe ? recipe?.name : <Skeleton width={300}/>}
                    </Typography>
                    <Typography fontWeight="light" gutterBottom sx={{
                        textAlign: {
                            xs: 'center',
                            sm: 'center',
                            md: 'left',
                        },
                        fontSize: {
                            xs: theme.typography.subtitle2.fontSize,
                            lg: theme.typography.subtitle1.fontSize,
                        },
                    }}>
                        {recipe ? "Autor: " + recipe?.creator : <Skeleton width={100}/>}
                    </Typography>
                    <Divider/>
                </Box>
                <Grid container spacing={8} columns={{xs: 8, sm: 8, md: 8, lg: 13, xl: 15}}>
                    <Grid item xs={8} sm={8} md={8} lg={3} xl={4} minWidth={300}>
                        <IngredientList ingredientSections={recipe?.ingredientSections}/>
                    </Grid>
                    <Grid item xs={8} sm={8} md={8} lg={9} xl={11}>
                        {recipe?.preparation && (
                            <>
                                <Typography marginTop={3} fontWeight="medium" gutterBottom sx={{
                                    fontSize: {
                                        xs: theme.typography.h6.fontSize,
                                        lg: theme.typography.h5.fontSize,
                                    },
                                }}>
                                    Przygotowanie:
                                </Typography>
                                <Typography sx={{
                                    fontSize: {
                                        xs: theme.typography.body2.fontSize,
                                        sm: theme.typography.body1.fontSize,
                                    },
                                    wordBreak: 'break-word',
                                    overflowWrap: 'break-word',
                                }} fontWeight="regular" style={{whiteSpace: 'pre-line'}}>
                                    {recipe.preparation}
                                </Typography>
                            </>
                        )}
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default RecipeDetails;
