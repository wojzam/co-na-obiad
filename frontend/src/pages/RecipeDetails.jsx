import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Box, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Skeleton, Typography} from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import BackButton from "../components/BackButton";

const RecipeDetails = () => {
    const {id} = useParams();
    const [recipe, setRecipe] = useState();

    useEffect(() => {
        fetch(`/api/recipes/${id}`, {})
            .then((response) => response.json())
            .then((data) => {
                setRecipe(data);
            });
    }, []);

    return (
        <>
            <BackButton/>
            <Box my="2em" width="100%">
                <Box mb={2}>
                    <Typography variant="h6" fontWeight="regular">
                        {recipe ? recipe?.category.name : <Skeleton width={100}/>}
                    </Typography>
                    <Typography component="h2" variant="h2" fontWeight="regular" gutterBottom>
                        {recipe ? recipe?.name : <Skeleton width={300}/>}
                    </Typography>
                    <Divider/>
                </Box>
                <Grid container spacing={8}>
                    <Grid item xs={12} md={3} minWidth={300}>
                        <Typography variant="h5" marginTop={3} fontWeight="medium" gutterBottom>
                            Składniki:
                        </Typography>
                        {recipe ? (
                            recipe?.ingredientSections.map((section) => (
                                <Box key={section._id} mb={2}>
                                    <Typography variant="h6" fontWeight="regular">
                                        {section.sectionName}
                                    </Typography>
                                    <List>
                                        {section.ingredients.map((ingredient, index) => (
                                            <ListItem key={index} disableGutters style={{margin: 0, padding: 1}}>
                                                <ListItemIcon style={{minWidth: 0, marginRight: 8}}>
                                                    <CircleIcon style={{fontSize: 10}}/>
                                                </ListItemIcon>
                                                <ListItemText>
                                                    {ingredient.name}
                                                    <span>&nbsp;&nbsp;</span> {ingredient.value} {ingredient.unit}
                                                </ListItemText>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            ))
                        ) : (
                            <Skeleton width={600}/>
                        )}
                    </Grid>
                    <Grid item xs={12} md={6} minWidth={600}>
                        {recipe?.comment && (
                            <>
                                <Typography marginTop={3} variant="h5" fontWeight="medium" gutterBottom>
                                    Komentarz:
                                </Typography>
                                <Typography variant="h6" fontWeight="regular" style={{whiteSpace: 'pre-line'}}>
                                    {recipe.comment}
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
