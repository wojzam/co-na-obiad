import {Controller, useFormContext} from "react-hook-form";
import TextField from "@mui/material/TextField";
import React from "react";

const maxLength = 7;

const IngredientValueInput = ({name}) => {
    const {control, setValue} = useFormContext();

    const inputRegex = /^[0-9.,\- /]*$/;
    const submitRegex = /^(\d+([.,]\d+)?|\d+\/\d+|\d+\s\d+\/\d+|\d+([.,]\d+)?\s*-\s*\d+([.,]\d+)?)$/;

    return (
        <Controller
            name={name} // Adjust according to your structure
            control={control}
            rules={{
                validate: (value) => !value || !value.trim() || submitRegex.test(value.trim())
            }}
            render={({field, fieldState: {error}}) => (
                <>
                    <TextField
                        type="text"
                        inputProps={{style: {padding: 11.5}, maxLength: maxLength}}
                        value={field.value || ""}
                        sx={{width: {xs: '100%', sm: 80}}}
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