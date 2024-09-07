import {useEffect, useState} from "react";
import {DragDropContext, Draggable, Droppable} from "@hello-pangea/dnd";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MessageBox from "../components/MessageBox";
import {useTheme} from "@mui/material";
import Button from "@mui/material/Button";
import ShuffleIcon from '@mui/icons-material/Shuffle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axios from "axios";
import IngredientList from "../components/IngredientList";
import Recipe from "../components/Recipe";
import Grid from "@mui/material/Grid";

export default function Menu() {
    const theme = useTheme();
    const [errorMessage, setErrorMessage] = useState("");

    const days = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];
    const emptyRecipes = () => days.reduce((recipesMap, day) => ({...recipesMap, [day]: null}), {});
    const mainCourses = "Dania główne";
    const [recipes, setRecipes] = useState(emptyRecipes());
    const [shoppingList, setShoppingList] = useState([]);

    useEffect(() => {
        getShoppingList();
    }, [recipes]);

    const getRandomRecipes = () => {
        setErrorMessage("");

        axios.get(`/api/menu/random?count=7&category=${mainCourses}`)
            .then((response) => {
                const recipesMap = {};

                days.forEach((day, index) => {
                    recipesMap[day] = response.data[index] || null;
                });

                setRecipes(recipesMap);
            }).catch(() => {
            setErrorMessage("Brak połączenia z serwerem");
        })
    }

    const getRandomRecipeForDay = (day) => {
        setErrorMessage("");

        axios.get(`/api/menu/random?count=1&category=${mainCourses}`)
            .then((response) => {
                const randomRecipe = response.data[0] || null;
                setRecipes((prevRecipes) => ({
                    ...prevRecipes,
                    [day]: randomRecipe,
                }));
            }).catch(() => {
            setErrorMessage("Brak połączenia z serwerem");
        })
    }

    const deleteRecipeForDay = (day) => {
        setRecipes((prevRecipes) => ({
            ...prevRecipes,
            [day]: null,
        }));
    };

    const getShoppingList = () => {
        setErrorMessage("");

        const endpoint = `/api/menu/shopping-list?`
            + days
                .filter(day => recipes[day] !== null)
                .map(day => `recipes[]=${recipes[day].id}`)
                .join("&");

        axios.get(endpoint)
            .then((response) => {
                setShoppingList(response.data);
            }).catch(() => {
            setErrorMessage("Brak połączenia z serwerem");
        })
    }

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const {source, destination} = result;
        if (source.index === destination.index) return;

        const newRecipes = {...recipes};
        const sourceDay = days[source.index];
        const destinationDay = days[destination.index];

        const temp = newRecipes[sourceDay];
        newRecipes[sourceDay] = newRecipes[destinationDay];
        newRecipes[destinationDay] = temp;

        setRecipes(newRecipes);
    };

    const EmptyRecipe = () => {
        return <Box display="flex" justifyContent="center" alignItems="center"
                    sx={{
                        my: 2,
                        py: 3,
                        px: 5,
                        height: "100%",
                        borderRadius: 8,
                        background: theme.palette.neutral.main,
                        boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                    }}>
            <Typography
                component="h2"
                sx={{
                    fontSize: {
                        xs: theme.typography.h6.fontSize,
                        lg: theme.typography.h5.fontSize,
                    },
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                }}
                fontWeight="light"
                align="center"
            >
                BEZ DANIA
            </Typography>
        </Box>;
    }

    return (
        <>
            <Typography component="h3" fontWeight="medium" color="error">W TRAKCIE TWORZENIA!</Typography>
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" width="100%"
                 gap={5} mb={5}>
                <Typography component="h1" fontWeight="medium" sx={{
                    fontSize: {xs: theme.typography.h4.fontSize, sm: theme.typography.h3.fontSize,}
                }}>
                    Menu
                </Typography>
                <Button variant="contained" startIcon={<ShuffleIcon/>} sx={{height: "fit-content"}}
                        onClick={getRandomRecipes}>
                    Wylosuj dania
                </Button>
            </Box>
            <MessageBox message={errorMessage} isError={true}/>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="recipes" direction="horizontal">
                    {(provided) => (
                        <Grid container ref={provided.innerRef} {...provided.droppableProps}
                              columnSpacing={5} rowSpacing={20} columns={{sm: 2, md: 8, lg: 8, xl: 12}}
                              alignItems="stretch" mb={15}>
                            {days.map((day, index) => (
                                <Grid item key={index} sm={2} md={4} lg={4} xl={4} width="100%" display="flex"
                                      flexDirection="column">
                                    <Typography component="h1" variant="h5" fontWeight="medium" gutterBottom
                                                textAlign={{xs: "center", sm: "center", md: "left"}}>
                                        {day}
                                    </Typography>
                                    <Draggable draggableId={day} index={index}>
                                        {(provided, snapshot) => (
                                            <Box ref={provided.innerRef}
                                                 {...provided.draggableProps}
                                                 {...provided.dragHandleProps}
                                                 sx={{
                                                     userSelect: 'none',
                                                     height: '80%',
                                                     ...snapshot.isDragging && {
                                                         position: 'relative',
                                                         zIndex: 10,
                                                         boxShadow: '0 5px 10px rgba(0,0,0,0.2)',
                                                     }
                                                 }}
                                            >
                                                {recipes[day] ? <Recipe {...recipes[day]} /> : <EmptyRecipe/>}
                                                <Box display="flex" justifyContent="center" alignItems="center" gap={2}
                                                     mt={2}>
                                                    <Button fullWidth variant="contained" startIcon={<ShuffleIcon/>}
                                                            onClick={() => getRandomRecipeForDay(day)}>
                                                        LOSUJ
                                                    </Button>
                                                    <Button fullWidth variant="outlined" color="error"
                                                            startIcon={<DeleteOutlineIcon/>}
                                                            onClick={() => deleteRecipeForDay(day)}>
                                                        USUŃ
                                                    </Button>
                                                </Box>
                                            </Box>
                                        )}
                                    </Draggable>
                                </Grid>
                            ))}
                            {provided.placeholder}
                        </Grid>
                    )}
                </Droppable>
            </DragDropContext>
            <Typography component="h1" fontWeight="medium" sx={{
                fontSize: {xs: theme.typography.h4.fontSize, sm: theme.typography.h3.fontSize,}
            }}>
                Lista zakupów
            </Typography>
            <IngredientList ingredientSections={[{ingredients: shoppingList}]}/>
        </>
    );
}
