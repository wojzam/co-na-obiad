import {useEffect, useState} from "react";
import {Autocomplete, TextField} from "@mui/material";

export default function IngredientFilterInput({}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        fetch("/api/recipes/ingredients")
            .then((response) => response.json())
            .then((data) => {
                setIngredients(data);
                console.log(data);
            });
    }, []);

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearch = (event) => {
    };

    return (
        <Autocomplete
            sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                height: 50,
                width: 300,
            }}
            multiple
            id="tags-outlined"
            options={ingredients}
            getOptionLabel={(option) => option.name}
            filterSelectedOptions
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Zawiera"
                />
            )}
        />
    );
}
