import {useState} from "react";
import {Button, Table, TableBody, TableCell, TableHead, TableRow, Typography, useTheme} from "@mui/material";
import {useNavigate} from "react-router-dom";
import RecipeListControls from "../components/RecipeListControls.jsx";

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
            <RecipeListControls setRecipes={setRecipes} onlyUser={true}/>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nazwa</TableCell>
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
                            sx={{ cursor: "pointer", backgroundColor: index % 2 === 0 ? theme.palette.neutral.main : theme.palette.neutral.darker }}
                        >
                            <TableCell>
                                <Typography component="h4" fontWeight="bold">
                                    {recipe.name}
                                </Typography>
                            </TableCell>
                            <TableCell>{recipe.ingredients}</TableCell>
                            <TableCell align="right">
                                <Button variant="outlined" onClick={(e) => handleEditClick(e, recipe.id)}>
                                    Edytuj
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};

export default UserRecipes;
