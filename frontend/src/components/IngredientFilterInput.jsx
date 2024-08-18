import {Autocomplete, TextField} from "@mui/material";
import {useIngredients} from "../hooks/useCachedData";

export default function IngredientFilterInput({onFilterChange, text}) {
    const ingredients = useIngredients();

    const handleInputChange = (event, value) => {
        const idsArray = extractChildrenIds(value);
        onFilterChange(text === "Zawiera" ? {include: idsArray} : {exclude: idsArray});
    };

    function extractChildrenIds(ingredientsInput) {
        const ingredientMap = new Map(ingredients.map(ing => [ing._id, ing]));

        const traverseAndCollectIds = (item, collectedIds) => {
            if (!item || !ingredientMap.has(item._id)) return;

            const ingredient = ingredientMap.get(item._id);
            if (collectedIds.has(ingredient._id)) return;
            collectedIds.add(ingredient._id);

            if (ingredient.children) {
                ingredient.children.forEach(child => traverseAndCollectIds(child, collectedIds));
            }
        };

        return ingredientsInput.map(ing => {
            const collectedIds = new Set();
            traverseAndCollectIds(ing, collectedIds);
            return Array.from(collectedIds);
        });
    }

    const filterNamesWithPolishLetters = (options, {inputValue}) => {
        return options.filter((option) =>
            option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
            option.name.toLowerCase().localeCompare(inputValue.toLowerCase(), 'pl', {sensitivity: 'base'}) === 0
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
                minWidth: 300
            }}
            multiple
            options={ingredients}
            getOptionLabel={(option) => option.name}
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
