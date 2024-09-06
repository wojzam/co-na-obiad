import {useState} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MessageBox from "../components/MessageBox";
import {useTheme} from "@mui/material";
import Button from "@mui/material/Button";
import ShuffleIcon from '@mui/icons-material/Shuffle';
import axios from "axios";
import IngredientList from "../components/IngredientList.jsx";

export default function Menu() {
    const theme = useTheme();
    const [errorMessage, setErrorMessage] = useState("");

    const days = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];
    const emptyRecipes = () => days.reduce((recipesMap, day) => ({...recipesMap, [day]: null}), {});
    const mainCourses = "Dania główne";
    const [recipes, setRecipes] = useState(emptyRecipes());
    const [shoppingList, setShoppingList] = useState([]);

    const getRandomRecipes = () => {
        setErrorMessage("");

        axios.get(`/api/menu/random?count=7&category=${mainCourses}`)
            .then((response) => {
                const recipes = response.data.recipes;
                const recipesMap = {};

                days.forEach((day, index) => {
                    recipesMap[day] = recipes[index] || null;
                });

                setRecipes(recipesMap);
                setShoppingList(response.data.shoppingList);
            }).catch(() => {
            setErrorMessage("Brak połączenia z serwerem");
        })
    }

    return (
        <>
            <Typography component="h1" fontWeight="medium" color="error" sx={{
                fontSize: {xs: theme.typography.h4.fontSize, sm: theme.typography.h3.fontSize,}
            }}>
                W TRAKCIE TWORZENIA!
            </Typography>
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
            {days.map((day, index) => (
                <Box mb={3} key={index}>
                    <Typography component="h1" variant="h5" gutterBottom>
                        {day}
                    </Typography>
                    <Box display="flex" justifyContent="center" alignItems="center"
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
                            {recipes[day] ? recipes[day].name : "BEZ DANIA"}
                        </Typography>
                    </Box>
                </Box>
            ))}

            <Typography component="h1" fontWeight="medium" sx={{
                fontSize: {xs: theme.typography.h4.fontSize, sm: theme.typography.h3.fontSize,}
            }}>
                Lista zakupów
            </Typography>
            <IngredientList ingredientSections={[{ingredients: shoppingList}]}/>
        </>
    );
}
