import {Autocomplete, TextField} from "@mui/material";
import {useIngredients} from "../hooks/useCachedData";

export default function IngredientFilterInput({onFilterChange, text}) {
    const ingredients = useIngredients();

    const handleInputChange = (event, value) => {
        const idsArray = extractChildrenIds(value);
        onFilterChange(text === "Zawiera" ? {include: idsArray} : {exclude: idsArray});
    };

    function extractChildrenIds(ingredientsInput) {
        const selectedIds = new Set();
        const ingredientMap = new Map(ingredients.map(ing => [ing._id, ing]));

        const traverseAndCollectIds = (item) => {
            if (!item || !ingredientMap.has(item._id)) return;

            const ingredient = ingredientMap.get(item._id);
            if (selectedIds.has(ingredient._id)) return;
            selectedIds.add(ingredient._id);

            if (ingredient.children) {
                ingredient.children.forEach(child => traverseAndCollectIds(child));
            }
        };

        ingredientsInput.forEach(ing => traverseAndCollectIds(ing));
        return Array.from(selectedIds);
    }

    return (
        <Autocomplete
            sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                height: 50,
                width: "auto",
                minWidth: 300
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
