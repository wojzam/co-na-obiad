import {useState} from "react";
import {
    Button,
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
import {useNavigate} from "react-router-dom";
import RecipesFilter from "../components/RecipesFilter";

const UserRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const navigate = useNavigate();
    const theme = useTheme();

    const handleRowClick = (id) => {
        navigate(`/recipes/${id}`);
    };

    const handleEditClick = (e, id) => {
        e.stopPropagation();
        navigate(`/edit-recipe/${id}`);
    };

    return (
        <>
            <Typography component="h1" variant="h2" fontWeight="medium" gutterBottom>Moje przepisy</Typography>
            <RecipesFilter setRecipes={setRecipes} onlyUser={true}/>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nazwa</TableCell>
                            <TableCell>Kategoria</TableCell>
                            <TableCell>Składniki</TableCell>
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
                                <TableCell>
                                    <Typography component="h4" fontWeight="bold">
                                        {recipe.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>{recipe.category}</TableCell>
                                <TableCell>{recipe.ingredients}</TableCell>
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
        </>
    );
};

export default UserRecipes;
