import {useEffect, useState} from "react";
import {
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import axios from "axios";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import useAuthAxios from "../hooks/useAuthAxios.jsx";
import MessageBox from "../components/MessageBox.jsx";

const Ingredients = () => {
    const axiosInstance = useAuthAxios();
    const [ingredients, setIngredients] = useState([]);
    const [newIngredient, setNewIngredient] = useState("");
    const [isPending, setIsPending] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const theme = useTheme();

    useEffect(() => {
        axios.get('/api/ingredients')
            .then((response) => {
                setIngredients(response.data);
                setIsPending(false);
            }).catch(() => {
            setIngredients([]);
            setIsPending(false);
        });
    }, []);

    const handleAdd = () => {
        setErrorMessage("");

        axiosInstance.post("/api/ingredients", {
            name: newIngredient.trim(),
        }, {
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then((response) => {
                setIngredients([...ingredients, {_id: response.data._id, name: response.data.name}]);
                setNewIngredient("");
            })
            .catch((error) => {
                if (error.response.data.message) setErrorMessage(error.response.data.message);
                else setErrorMessage("Wystąpił nieoczekiwany błąd");
            });
    };

    const handleSave = (id, name) => {
        setErrorMessage("");

        axiosInstance.put(`/api/ingredients/${id}`, {
            name: name.trim(),
        }, {
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then((response) => {
                setIngredients(ingredients.map(ingredient =>
                    ingredient._id === response.data._id ? {...ingredient, name: response.data.name} : ingredient
                ));
            })
            .catch(() => {
                setErrorMessage("Wystąpił nieoczekiwany błąd");
            });
    };

    const handleInputChange = (id, value) => {
        setIngredients(ingredients.map(ingredient =>
            ingredient._id === id ? {...ingredient, name: value} : ingredient
        ));
    };

    return (
        <>
            <Typography component="h1" variant="h2" fontWeight="medium" gutterBottom>Składniki</Typography>
            <MessageBox message={errorMessage} isError={true}/>
            <Box display="flex" alignItems="center" padding={2} gap={6} marginBottom={3} sx={{
                border: '1px solid grey',
                borderRadius: '8px'
            }}>
                <TextField
                    label="Nazwa"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                />
                <Button variant="contained" onClick={handleAdd}>Dodaj składnik</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table size={"small"}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nazwa</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ingredients && ingredients.map((ingredient, index) => (
                            <TableRow
                                key={ingredient._id}
                                sx={{
                                    backgroundColor: index % 2 === 0 ? theme.palette.neutral.main : theme.palette.neutral.darker
                                }}>
                                <TableCell>
                                    <TextField
                                        value={ingredient.name}
                                        onChange={(e) => handleInputChange(ingredient._id, e.target.value)}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Button variant="outlined"
                                            onClick={() => handleSave(ingredient._id, ingredient.name)}>Zapisz</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {isPending ? <CircularProgress/> :
                ingredients.length === 0 && <Typography variant="h6" component="p">Brak wyników</Typography>}
        </>
    );
};

export default Ingredients;
