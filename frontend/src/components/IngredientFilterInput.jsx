import {Autocomplete, TextField} from "@mui/material";
import {useIngredients} from "../hooks/useCachedData";

export default function IngredientFilterInput({onFilterChange, text}) {
    const ingredients = useIngredients();

    const handleInputChange = (event, value) => {
        const selectedIds = value.flatMap((ing) => {
            const id = [ing._id];
            const childrenIds = ing.children ? ing.children.map((c) => c._id) : [];
            return [...id, ...childrenIds];
        });
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
