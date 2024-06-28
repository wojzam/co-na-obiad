import {useState} from "react";
import TextField from "@mui/material/TextField";

const ValidatedTextField = ({
                                id = "",
                                label = "",
                                name = "",
                                type = "",
                                autoComplete = "",
                                minLength = 1,
                                maxLength = 64,
                                validateEmail = false,
                                value: initialValue = "",
                                onChange = () => {
                                },
                                multiline = false,
                                rows = 1,
                                sx = {},
                                required=true
                            }) => {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleInputChange = (e) => {
        onChange(e);
        setValue(e.target.value);
        validateInput(e.target.value);
    };

    const validateInput = (input) => {
        const valueLength = input.trim().length;
        const isTooShort = valueLength < minLength;
        const isTooLong = valueLength > maxLength;
        const emailInvalid = isEmailInvalid(input);
        setError(isTooShort || isTooLong || emailInvalid);
        setErrorMessage(
            emailInvalid
                ? "Email is invalid"
                : isTooShort
                    ? minLength === 1
                        ? `${label} nie może być pusta`
                        : `${label} musi mieć przynamniej ${minLength} znaków`
                    : isTooLong
                        ? `${label} jest za długi`
                        : ""
        );
    };

    const isEmailInvalid = (email) => {
        if (validateEmail && email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return !emailRegex.test(email);
        }
        return false;
    };

    return (
        <TextField
            required={required}
            fullWidth
            id={id}
            name={name}
            label={label}
            type={type}
            autoComplete={autoComplete}
            value={value}
            error={error}
            helperText={error && errorMessage}
            onChange={handleInputChange}
            multiline={multiline}
            rows={rows}
            sx={sx}
        />
    );
};

export default ValidatedTextField;
