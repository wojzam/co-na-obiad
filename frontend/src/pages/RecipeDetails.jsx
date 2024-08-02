import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Box, Divider, Skeleton, Typography} from "@mui/material";
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
            <Box
                display="flex"
                justifyContent="space-between"
                gap="4em"
                width="100%"
                my="2em"
            >
                <Box width="100%">
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                    >
                        <Typography variant="h6" fontWeight="regular">
                            {recipe ? recipe?.category.name : <Skeleton width={100}/>}
                        </Typography>
                        <Typography component="h2" variant="h2" fontWeight="regular" gutterBottom>
                            {recipe ? recipe?.name : <Skeleton width={300}/>}
                        </Typography>
                        <Divider/>
                        <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
                            <Box>
                                <Typography variant="h5" marginTop={3} fontWeight="medium" gutterBottom>
                                    Składniki:
                                </Typography>
                                {recipe ? (
                                    recipe?.ingredientSections.map((section) => (
                                        <div key={section._id}>
                                            <Typography variant="h6"
                                                        fontWeight="regular">{section.section_name}</Typography>
                                            <ul>
                                                {section.ingredients.map((ingredient) => (
                                                    <li key={ingredient._id}>{ingredient.name}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))) : (
                                    <Skeleton width={600}/>
                                )}
                            </Box>
                            <Box width="80%">
                                {recipe?.comment && (
                                    <>
                                        <Typography marginTop={3} variant="h5" fontWeight="medium"
                                                    gutterBottom>Komentarz:</Typography>
                                        <Typography variant="h6" fontWeight="regular">{recipe.comment}</Typography>
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default RecipeDetails;
