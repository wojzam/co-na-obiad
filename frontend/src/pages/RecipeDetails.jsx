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
                    <Box display="flex" gap={1} flexWrap="wrap"
                         sx={{justifyContent: {xs: "center", sm: 'center', md: 'left'}}}>
                        {recipe ? recipe?.categories.map(category => (
                                <Typography key={category._id} fontWeight="regular" gutterBottom sx={{
                                    display: 'inline-block',
                                    backgroundColor: "lightgray",
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
                <Grid container spacing={8} columns={{sm: 8, md: 8, lg: 12, xl: 14}}>
                    <Grid item sm={8} md={3} lg={3} xl={3} minWidth={300}>
                        <Typography marginTop={3} fontWeight="medium" gutterBottom sx={{
                            fontSize: {
                                xs: theme.typography.h6.fontSize,
                                lg: theme.typography.h5.fontSize,
                            },
                        }}>
                            Składniki:
                        </Typography>
                        {recipe ? (
                            recipe?.ingredientSections.map((section) => (
                                <Box key={section._id} mt={section._id > 1 ? 5 : 0}>
                                    <Typography variant="h6" fontWeight="regular">
                                        {section.sectionName}{section.sectionName && ":"}
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
                    <Grid item sm={8} md={8} lg={8} xl={10}>
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
