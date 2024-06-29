import {useEffect, useState} from "react";
import {Autocomplete, TextField} from "@mui/material";

export default function IngredientFilterInput({filter, onFilterChange, text}) {
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        fetch("/api/recipes/ingredients")
            .then((response) => response.json())
            .then((data) => {
                setIngredients(data);
            });
    }, []);

    const handleInputChange = (event, value) => {
        const selectedIds = value.map((item) => item._id);
        onFilterChange(text === "Zawiera" ? {include: selectedIds} : {exclude: selectedIds});
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
            onChange={handleInputChange}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={text}
                />
            )}
        />
    );
}
