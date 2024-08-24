import React from "react";
import {Controller, useFormContext} from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import TableCell from "@mui/material/TableCell";
import IngredientValueInput from "./IngredientValueInput";
import {filterNamesWithPolishLetters} from "../../utils/filerNamesWithPolishLetters";
import {useMediaQuery} from "@mui/material";
import Box from "@mui/material/Box";

const IngredientValueUnit = ({ingredients, units, name, watchedIngredients, handleAddRow}) => {
    const {control} = useFormContext();

    const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));

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

    const NameInput = () => (
        <Controller
            name={`${name}.name`}
            control={control}
            render={({field}) => (
                <Autocomplete
                    disablePortal
                    options={ingredients.map((i) => i.name)}
                    filterSelectedOptions
                    filterOptions={filterNamesWithPolishLetters}
                    value={field.value || null}
                    sx={{
                        '& .MuiInputBase-root': {padding: 0.5},
                    }}
                    onChange={(e, v) => handleIngredientNameChange(field, v)}
                    renderInput={(params) => <TextField
                        {...params}
                        label={isSmallScreen ? "Nazwa" : ""}
                        InputLabelProps={{shrink: true}}
                        placeholder={field.value > 0 ? "" : "Zacznij pisać..."}
                    />}
                />
            )}
        />
    );

    const UnitInput = () => (
        <Controller
            name={`${name}.unit`}
            control={control}
            render={({field}) => (
                <Autocomplete
                    options={units.map((unit) => unit.name)}
                    value={field.value || null}
                    sx={{
                        '& .MuiInputBase-root': {padding: 0.5},
                    }}
                    onChange={(e, v) => field.onChange(v)}
                    renderInput={(params) => <TextField
                        {...params}
                        label={isSmallScreen ? "Jednostka" : ""}
                        InputLabelProps={{shrink: true}}
                    />}
                />
            )}
        />
    );

    return (
        <>
            {isSmallScreen ? (
                <Box my={1} mx={1}>
                    <Box sx={{mb: 2}}>
                        <NameInput/>
                    </Box>
                    <Box display="flex" flexDirection="row">
                        <Box sx={{flexBasis: '40%', flexGrow: 1, mr: 1}}>
                            <IngredientValueInput name={`${name}.value`} sx={{width: "100%"}}/>
                        </Box>
                        <Box sx={{flexBasis: '60%', flexGrow: 2}}>
                            <UnitInput/>
                        </Box>
                    </Box>
                </Box>
            ) : (
                <>
                    <TableCell>
                        <NameInput/>
                    </TableCell>
                    <TableCell>
                        <IngredientValueInput name={`${name}.value`}/>
                    </TableCell>
                    <TableCell>
                        <UnitInput/>
                    </TableCell>
                </>
            )}
        </>
    );
};

export default IngredientValueUnit;
