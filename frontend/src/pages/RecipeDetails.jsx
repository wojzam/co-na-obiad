import {useEffect, useState} from "react";
import {Box, Button, Divider, Grid, Skeleton, Typography, useTheme} from "@mui/material";
import BackButton from "../components/BackButton";
import {useRecipe} from "../hooks/useRecipe";
import IngredientList from "../components/IngredientList";
import CategoryLink from "../components/CategoryLink";
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import useAuthAxios from "../hooks/useAuthAxios";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CommentsSection from "../components/CommentsSection";

const RecipeDetails = () => {
    const recipe = useRecipe();
    const [isSaved, setIsSaved] = useState(false);
    const axiosInstance = useAuthAxios();
    const theme = useTheme();

    const handleSave = () => {
        if (isSaved) {
            axiosInstance.delete(`/api/recipes/${recipe._id}/save`)
                .then(() => {
                })
                .catch(() => {
                });
            setIsSaved(false);
        } else {
            axiosInstance.post(`/api/recipes/${recipe._id}/save`)
                .then(() => {
                })
                .catch(() => {
                });
            setIsSaved(true);
        }
    }

    useEffect(() => {
        if (recipe && 'saved' in recipe) setIsSaved(recipe.saved);
    }, [recipe]);

    return (
        <>
            <BackButton/>
            <Box my="2em" width="100%">
                <Box mb={2} display="flex" flexDirection={{xs: 'column-reverse', sm: 'column-reverse', md: 'row'}}
                     justifyContent="space-between">
                    <Box>
                        <Box display="flex" gap={1} flexWrap="wrap"
                             sx={{justifyContent: {xs: "center", sm: 'center', md: 'left'}}}>
                            {recipe ? recipe?.categories.map(category => (
                                    <CategoryLink key={category._id} category={category}/>
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
                        }} fontWeight="bolder">
                            {recipe ? recipe?.name : <Skeleton width={300}/>}
                        </Typography>
                        <Typography fontWeight="lighter" sx={{
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
                            {recipe ? (
                                <>
                                    Dodane przez:&nbsp;
                                    <Typography component="span" fontWeight="regular">
                                        {recipe.creator}
                                    </Typography>
                                </>
                            ) : (
                                <Skeleton width={100}/>
                            )}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="end" gap={2}>
                        <Button sx={{
                            display: recipe && 'saved' in recipe ? "inherit" : "none",
                            height: "fit-content",
                            width: "fit-content",
                            mb: {xs: 3, sm: 3, md: 0}
                        }}
                                color={isSaved ? "secondary" : "primary"}
                                startIcon={<TurnedInNotIcon/>}
                                variant="outlined"
                                onClick={handleSave}>
                            {isSaved ? "Zapisano" : "Zapisz"}
                        </Button>
                        <Button sx={{
                            display: recipe && 'canEdit' in recipe ? "inherit" : "none",
                            height: "fit-content",
                            width: "fit-content",
                            mb: {xs: 3, sm: 3, md: 0}
                        }}
                                startIcon={<EditOutlinedIcon/>}
                                variant="outlined"
                                href={`/edit-recipe/${recipe?._id}`}
                                disabled={!recipe?.canEdit}>
                            Edytuj
                        </Button>
                    </Box>
                </Box>
                <Divider/>
                <Grid container spacing={8} columns={{xs: 8, sm: 8, md: 8, lg: 13, xl: 15}}>
                    <Grid item xs={8} sm={8} md={8} lg={3} xl={4} minWidth={300}>
                        <IngredientList ingredientSections={recipe?.ingredientSections}/>
                    </Grid>
                    <Grid item xs={8} sm={8} md={8} lg={9} xl={11}>
                        {recipe?.preparation && (
                            <>
                                <Typography marginTop={3} fontWeight="bold" gutterBottom
                                            sx={{
                                                fontSize: {
                                                    xs: theme.typography.h6.fontSize,
                                                    lg: theme.typography.h5.fontSize,
                                                },
                                            }}>
                                    Przygotowanie:
                                </Typography>
                                <Typography variant="body1" sx={{
                                    wordBreak: 'break-word',
                                    overflowWrap: 'break-word',
                                }} fontWeight="regular" style={{whiteSpace: 'pre-line'}}>
                                    {recipe.preparation}
                                </Typography>
                            </>
                        )}
                    </Grid>
                </Grid>
                <CommentsSection recipeId={recipe?._id} initialCanComment={recipe?.canComment}
                                 initialComments={recipe?.comments}/>
            </Box>
        </>
    );
};

export default RecipeDetails;
