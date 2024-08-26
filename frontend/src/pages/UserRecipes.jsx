import {useState} from "react";
import {
    Box,
    Button,
    CircularProgress,
    Grow,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme
} from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/Add';
import {useNavigate} from "react-router-dom";
import RecipesFetcher from "../components/RecipesFetcher";
import truncateText from "../utils/truncateText";
import Link from "@mui/material/Link";

const maxNameLength = 80;
const maxIngredientsLength = 100;

const UserRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [isPending, setIsPending] = useState(true);
    const navigate = useNavigate();
    const theme = useTheme();

    const handleRowClick = (id) => {
        navigate(`/recipes/${id}`);
    };

    const handleEditClick = (e, id) => {
        e.stopPropagation();
        navigate(`/edit-recipe/${id}`);
    };

    const hideOnSmallerScreen = {
        display: {
            xs: 'none',
            sm: 'none',
            md: 'table-cell',
        }
    }

    return (
        <>
            <Typography component="h1" fontWeight="medium" gutterBottom sx={{
                fontSize: {
                    xs: theme.typography.h4.fontSize,
                    sm: theme.typography.h3.fontSize,
                }
            }}>
                Moje przepisy
            </Typography>
            <RecipesFetcher {...{setRecipes, isPending, setIsPending}} onlyUser={true} id={"/user-recipes"}/>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nazwa</TableCell>
                            <TableCell align="right" sx={hideOnSmallerScreen}>Kategorie</TableCell>
                            <TableCell align="right" sx={hideOnSmallerScreen}>Składniki</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {recipes && recipes.map((recipe, index) => (
                            <TableRow
                                key={recipe.id}
                                hover
                                onClick={() => handleRowClick(recipe.id)}
                                sx={{
                                    backgroundColor: index % 2 === 0 ? theme.palette.neutral.main : theme.palette.neutral.darker,
                                    cursor: 'pointer'
                                }}
                            >
                                <TableCell sx={{minWidth: {xs: 100, sm: 150, md: 250}}}>
                                    <Typography component="h4" fontWeight="bold"
                                                sx={{
                                                    wordBreak: 'break-word',
                                                    overflowWrap: 'break-word',
                                                }}>
                                        {truncateText(recipe.name, maxNameLength)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right" sx={hideOnSmallerScreen}>{recipe.categories}</TableCell>
                                <TableCell align="right" sx={hideOnSmallerScreen}>
                                    {truncateText(
                                        recipe.ingredients +
                                        (recipe.additionalIngredients && `, ${recipe.additionalIngredients}`),
                                        maxIngredientsLength)}
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="outlined"
                                        onClick={(e) => handleEditClick(e, recipe.id)}
                                        startIcon={<EditOutlinedIcon/>}
                                    >
                                        Edytuj
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {isPending ?
                <Box display="flex" justifyContent="center" width="100%" mt={7}>
                    <CircularProgress size={100}/>
                </Box> : recipes && recipes.length === 0 &&
                <Grow in timeout={500}>
                    <Box width="100%">
                        <Typography mt={2} variant="h5" component="p">Brak przepisów</Typography>
                        <Link href="/create-recipe" color="inherit" underline="none">
                            <Box width="100%" p={2} my={5}
                                 display="flex" justifyContent="center" alignItems="center" gap={2}
                                 sx={{
                                     borderColor: 'primary.main', borderStyle: "dashed", borderRadius: "20px",
                                     "&:hover": {
                                         borderStyle: "solid",
                                         boxShadow: "0px 6px 9px rgba(0, 0, 0, 0.30)",
                                     },
                                 }}>
                                <Typography variant="h6">
                                    DODAJ PRZEPIS
                                </Typography>
                                <AddIcon/>
                            </Box>
                        </Link>
                    </Box>
                </Grow>}
        </>
    );
};

export default UserRecipes;
