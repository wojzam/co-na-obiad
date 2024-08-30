import {Controller, useFormContext} from "react-hook-form";
import TextField from "@mui/material/TextField";
import React from "react";
import {useMediaQuery} from "@mui/material";

const maxLength = 7;

const IngredientValueInput = ({name}) => {
    const {control, setValue} = useFormContext();

    const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));

    const inputRegex = /^[0-9.,\- /]*$/;
    const submitRegex = /^(\d+([.,]\d+)?|\d+\/\d+|\d+\s\d+\/\d+|\d+([.,]\d+)?\s*-\s*\d+([.,]\d+)?)$/;

    return (
        <Controller
            name={name}
            control={control}
            rules={{
                validate: (value) => !value || !value.trim() || submitRegex.test(value.trim())
            }}
            render={({field, fieldState: {error}}) => (
                <>
                    <TextField
                        type="text"
                        label={isSmallScreen ? "Wartość" : ""}
                        InputLabelProps={{shrink: true,}}
                        inputProps={{style: {padding: 11.5}, maxLength: maxLength}}
                        value={field.value || ""}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            if (inputRegex.test(newValue)) {
                                setValue(field.name, newValue);
                            }
                        }}
                        error={!!error}
                    />
                </>
            )}
        />
    );
}

export default IngredientValueInput;