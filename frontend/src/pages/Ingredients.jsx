import {useEffect, useState} from "react";
import {
    Autocomplete,
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
import useAuthAxios from "../hooks/useAuthAxios";
import MessageBox from "../components/MessageBox";

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
                setIngredients(convertChildrenToParent(response.data));
                setIsPending(false);
            }).catch(() => {
            setIngredients([]);
            setIsPending(false);
        });
    }, []);

    function convertChildrenToParent(data) {
        data.forEach(ing => {
            if (ing.children) {
                ing.children.forEach(child => {
                    data.find(i => i._id === child._id).parent = ing._id;
                });
                delete ing.children;
            }
        });
        return data;
    }

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

    const handleSave = (id) => {
        setErrorMessage("");

        const ingredient = ingredients.find(ingredient => ingredient._id === id);
        const children = ingredients.filter(ingredient => ingredient.parent === id).map((ing) => ing._id);

        axiosInstance.put(`/api/ingredients/${id}`, {
            name: ingredient.name.trim(),
            children: children
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

    const handleNameChange = (id, value) => {
        setIngredients(ingredients.map(ingredient =>
            ingredient._id === id ? {...ingredient, name: value} : ingredient
        ));
    };

    const handleParentChange = (id, value) => {
        if (value) {
            const parentId = ingredients.find(ingredient => ingredient.name === value)._id;
            setIngredients(ingredients.map(ingredient =>
                ingredient._id === id ? {...ingredient, parent: parentId} : ingredient
            ));
        } else {
            setIngredients(ingredients.map(ingredient =>
                ingredient._id === id ? {...ingredient, parent: null} : ingredient
            ));
        }
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
                            <TableCell>Nadrzędny składnik</TableCell>
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
                                        onChange={(e) => handleNameChange(ingredient._id, e.target.value)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Autocomplete
                                        sx={{width: 300}}
                                        value={ingredients.find(ing => ing._id === ingredient.parent)?.name || null}
                                        options={ingredients.map((ing) => ing.name)}
                                        filterSelectedOptions
                                        onChange={(e, newValue) => handleParentChange(ingredient._id, newValue)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                            />
                                        )}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Button variant="outlined"
                                            onClick={() => handleSave(ingredient._id)}>Zapisz</Button>
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
