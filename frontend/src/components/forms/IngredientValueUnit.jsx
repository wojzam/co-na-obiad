import TableCell from "@mui/material/TableCell";
import {Controller, useFormContext} from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React from "react";

const IngredientValueUnit = ({ingredients, units, name, watchedIngredients, handleAddRow}) => {
    const {control} = useFormContext();

    const filterOptionsWithPolishLetters = (options, {inputValue}) => {
        return options.filter((option) =>
            option.toLowerCase().includes(inputValue.toLowerCase()) ||
            option.toLowerCase().localeCompare(inputValue.toLowerCase(), 'pl', {sensitivity: 'base'}) === 0
        );
    };

    const handleIngredientNameChange = (field, value) => {
        field.onChange(value);
        if (value && getIndex() === watchedIngredients.length - 1) {
            handleAddRow();
        }
    }

    const getIndex = () => {
        const regex = /ingredients\[(\d+)\]/;
        const match = name.match(regex);
        if (match) return parseInt(match[1], 10);
        return 0;
    };

    return (
        <>
            <TableCell>
                <Controller
                    name={`${name}.name`}
                    control={control}
                    render={({field}) => (
                        <Autocomplete
                            disablePortal
                            options={ingredients.map((i) => i.name)}
                            filterSelectedOptions
                            filterOptions={filterOptionsWithPolishLetters}
                            value={field.value || null}
                            sx={{
                                '& .MuiInputBase-root': {padding: 0.5},
                                width: {xs: '100%', sm: 220},
                            }}
                            onChange={(e, v) => handleIngredientNameChange(field, v)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    )}
                />
            </TableCell>
            <TableCell align="right">
                <Controller
                    name={`${name}.value`}
                    control={control}
                    render={({field}) => (
                        <TextField
                            type="number"
                            inputProps={{
                                min: 0,
                                max: 9999,
                                style: {padding: 11.5}
                            }}
                            value={field.value || ""}
                            sx={{width: {xs: '100%', sm: 80}}}
                            onChange={(e) => field.onChange(e.target.value)}
                        />
                    )}
                />
            </TableCell>
            <TableCell align="right">
                <Controller
                    name={`${name}.unit`}
                    control={control}
                    render={({field}) => (
                        <Autocomplete
                            options={units.map((unit) => unit.name)}
                            value={field.value || null}
                            sx={{
                                '& .MuiInputBase-root': {padding: 0.5},
                                width: {xs: '100%', sm: 150}
                            }}
                            onChange={(e, v) => field.onChange(v)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    )}
                />
            </TableCell>
        </>
    );
}

export default IngredientValueUnit;