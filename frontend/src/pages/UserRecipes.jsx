import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    Box,
    Button,
    CircularProgress,
    Grow,
    Link,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    useTheme
} from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/Add';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import RecipesFetcher, {TYPE_SAVED, TYPE_USER} from "../components/RecipesFetcher";
import truncateText from "../utils/truncateText";

const maxNameLength = 80;
const maxCategoriesLength = 37;
const maxIngredientsLength = 90;

const UserRecipes = () => {
    const [selectedView, setSelectedView] = useState(TYPE_USER);
    const [recipes, setRecipes] = useState([]);
    const [isPending, setIsPending] = useState(true);
    const [fetcherKey, setFetcherKey] = useState(0);
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        setRecipes([]);
        setIsPending(true);
        setFetcherKey((prevKey) => prevKey + 1);
    }, [selectedView]);

    const handleAlignmentChange = (event, newAlignment) => {
        if (newAlignment === null) return;
        setSelectedView(newAlignment);
    };

    const handleRowClick = (id) => {
        navigate(`/recipes/${id}`);
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
            <ToggleButtonGroup
                color="primary"
                value={selectedView}
                exclusive
                size="large"
                fullWidth
                onChange={handleAlignmentChange}
                sx={{mb: 4, mt: {xs: 3, sm: 2, md: 0}}}>
                <ToggleButton sx={{fontWeight: selectedView === TYPE_USER ? "bold" : "regular"}} value={TYPE_USER}>
                    Moje przepisy
                </ToggleButton>
                <ToggleButton sx={{fontWeight: selectedView === TYPE_SAVED ? "bold" : "regular"}} value={TYPE_SAVED}>
                    Zapisane
                </ToggleButton>
            </ToggleButtonGroup>
            <RecipesFetcher key={fetcherKey} {...{setRecipes, isPending, setIsPending}} type={selectedView}
                            id={"/user-recipes"}/>
            <TableContainer component={Paper}>
                <Table>
                    {recipes && recipes.length > 0 && (
                        <TableHead>
                            <TableRow>
                                <TableCell>Nazwa</TableCell>
                                <TableCell align="right" sx={hideOnSmallerScreen}>Kategorie</TableCell>
                                <TableCell align="right" sx={hideOnSmallerScreen}>Składniki</TableCell>
                                {selectedView === TYPE_USER && (<>
                                    <TableCell align="right" sx={hideOnSmallerScreen}>
                                        <CommentOutlinedIcon fontSize="large" sx={{pt: 1.2, pl: 2}}/>
                                    </TableCell>
                                    <TableCell align="right"></TableCell>
                                </>)}
                            </TableRow>
                        </TableHead>
                    )}
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
                                <TableCell align="right" sx={hideOnSmallerScreen}>
                                    {truncateText(recipe.categories, maxCategoriesLength)}
                                </TableCell>
                                <TableCell align="right" sx={hideOnSmallerScreen}>
                                    {truncateText(
                                        recipe.ingredients +
                                        (recipe.additionalIngredients && `, ${recipe.additionalIngredients}`),
                                        maxIngredientsLength)}
                                </TableCell>
                                {selectedView === TYPE_USER && (<>
                                        <TableCell align="right" sx={hideOnSmallerScreen}>
                                            {recipe.comments}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                variant="outlined"
                                                href={`/edit-recipe/${recipe.id}`}
                                                onClick={(e) => e.stopPropagation()}
                                                startIcon={<EditOutlinedIcon/>}
                                            >
                                                Edytuj
                                            </Button>
                                        </TableCell>
                                    </>
                                )}
                            < /TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {
                isPending ?
                    <Box display="flex" justifyContent="center" width="100%" mt={7}>
                        <CircularProgress size={100}/>
                    </Box> : recipes && recipes.length === 0 &&
                    <Grow in timeout={500}>
                        <Box width="100%">
                            {selectedView === TYPE_USER ? (
                                <>
                                    <Typography mt={2} variant="h5" component="p">Brak przepisów</Typography>
                                    <Link href="/create-recipe" color="inherit" underline="none">
                                        <Box width="100%" p={2} my={5}
                                             display="flex" justifyContent="center" alignItems="center" gap={2}
                                             sx={{
                                                 borderColor: 'primary.main',
                                                 borderStyle: "dashed",
                                                 borderRadius: "20px",
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
                                </>
                            ) : (
                                <>
                                    <Typography mt={2} variant="h5" component="p">Brak zapisanych przepisów</Typography>
                                    <Typography variant="subtitle2" fontWeight="lighter" component="p">(otwórz przepis i
                                        kliknij
                                        "ZAPISZ")</Typography>
                                </>
                            )}
                        </Box>
                    </Grow>
            }
        </>
    )
        ;
};

export default UserRecipes;
