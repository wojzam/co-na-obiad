import {useEffect, useState} from "react";
import {Autocomplete, TextField} from "@mui/material";
import {useIngredients} from "../hooks/useCachedData";

const MAX_INGREDIENTS = 20;

export default function IngredientFilterInput({initialIngredients, onFilterChange, text}) {
    const ingredients = useIngredients();
    const [selectedIngredients, setSelectedIngredients] = useState(initialIngredients);

    useEffect(() => {
        setSelectedIngredients(initialIngredients);
    }, [initialIngredients]);

    const handleInputChange = (event, value) => {
        setSelectedIngredients(value)
        onFilterChange(text === "Zawiera" ? {include: value} : {exclude: value});
    };

    const filterNamesWithPolishLetters = (options, {inputValue}) => {
        return options.filter((option) =>
            option.toLowerCase().includes(inputValue.toLowerCase()) ||
            option.toLowerCase().localeCompare(inputValue.toLowerCase(), 'pl', {sensitivity: 'base'}) === 0
        );
    };

    return (
        <Autocomplete
            sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                height: 50,
                width: "auto",
                minWidth: 200
            }}
            multiple
            value={selectedIngredients}
            options={ingredients.map(i => i.name)}
            getOptionDisabled={() => (selectedIngredients.length >= MAX_INGREDIENTS)}
            filterSelectedOptions
            filterOptions={filterNamesWithPolishLetters}
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
