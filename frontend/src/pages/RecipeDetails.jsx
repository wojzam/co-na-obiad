import {
    Box,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Skeleton,
    Typography,
    useTheme
} from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import BackButton from "../components/BackButton";
import {useRecipe} from "../hooks/useRecipe.jsx";

const RecipeDetails = () => {
    const recipe = useRecipe();
    const theme = useTheme();

    return (
        <>
            <BackButton/>
            <Box my="2em" width="100%">
                <Box mb={2}>
                    <Typography variant="subtitle1" fontWeight="regular" sx={{
                        textAlign: {
                            xs: 'center',
                            sm: 'center',
                            md: 'left',
                        }
                    }}>
                        {recipe ? recipe?.category.name : <Skeleton width={100}/>}
                    </Typography>
                    <Typography sx={{
                        fontSize: {
                            xs: theme.typography.h3.fontSize,
                            sm: theme.typography.h3.fontSize,
                            lg: theme.typography.h2.fontSize,
                        },
                        textAlign: {
                            xs: 'center',
                            sm: 'center',
                            md: 'left',
                        }
                    }} fontWeight="medium" gutterBottom>
                        {recipe ? recipe?.name : <Skeleton width={300}/>}
                    </Typography>
                    <Divider/>
                </Box>
                <Grid container spacing={8} columns={{sm: 8, md: 8, lg: 12, xl: 14}}>
                    <Grid item sm={8} md={3} lg={3} xl={3} minWidth={300}>
                        <Typography variant="h5" marginTop={3} fontWeight="medium" gutterBottom>
                            Składniki:
                        </Typography>
                        {recipe ? (
                            recipe?.ingredientSections.map((section) => (
                                <Box key={section._id} mt={section._id > 1 ? 5 : 0}>
                                    <Typography variant="h6" fontWeight="regular">
                                        {section.sectionName}
                                    </Typography>
                                    <List>
                                        {section.ingredients.map((ingredient, index) => (
                                            <ListItem key={index} disableGutters style={{margin: 0, padding: 1}}>
                                                <ListItemIcon style={{minWidth: 0, marginRight: 8}}>
                                                    <CircleIcon
                                                        style={{fontSize: 8, color: theme.palette.primary.main}}/>
                                                </ListItemIcon>
                                                <ListItemText
                                                    disableTypography
                                                    primary={<Typography variant="body1" fontWeight="medium"
                                                                         color={theme.palette.primary.main}>
                                                        {ingredient.name}
                                                        <span>&nbsp;&nbsp;</span>
                                                        <span style={{fontWeight: 'lighter'}}>
                                                            {ingredient.value} {ingredient.unit}
                                                        </span>
                                                    </Typography>}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            ))
                        ) : (
                            <Skeleton width={600}/>
                        )}
                    </Grid>
                    <Grid item sm={8} md={5} lg={8} xl={10}>
                        {recipe?.comment && (
                            <>
                                <Typography marginTop={3} variant="h5" fontWeight="medium" gutterBottom>
                                    Komentarz:
                                </Typography>
                                <Typography sx={{
                                    fontSize: {
                                        xs: theme.typography.body1.fontSize,
                                        sm: theme.typography.body1.fontSize,
                                        lg: theme.typography.h6.fontSize,
                                    }
                                }} fontWeight="regular" style={{whiteSpace: 'pre-line'}}>
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
