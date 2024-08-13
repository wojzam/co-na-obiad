import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Box, Button, TextField, Typography} from '@mui/material';
import useAuthAxios from "../hooks/useAuthAxios.jsx";
import MessageBox from "./MessageBox.jsx";

const UpdatePassword = () => {
    const axiosInstance = useAuthAxios();
    const [message, setMessage] = useState("");
    const {handleSubmit, control, reset, setError, formState: {errors}, getValues} = useForm({
        mode: "all",
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    const passwordRules = {
        minLength: {
            value: 8,
            message: "Hasło musi mieć przynajmniej 8 znaków"
        },
        maxLength: {
            value: 64,
            message: "Hasło nie może przekraczać 64 znaków"
        }
    };

    const onSubmit = (data) => {
        setMessage("");

        axiosInstance.put("/api/users/update-password", {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
        }, {
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then(() => {
                setMessage("Zmieniono hasło")
                reset();
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    setError("currentPassword", {message: "Nieprawidłowe hasło"});
                } else {
                    setError("root", {message: "Wystąpił nieoczekiwany błąd"});
                }
            });
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{mt: 5, width: '100%'}}
        >
            <Typography component="h2" variant="h6" gutterBottom> Zmień hasło </Typography>
            <MessageBox message={message}/>
            <MessageBox message={errors.root} isError={true}/>
            <Controller
                name="currentPassword"
                control={control}
                rules={{
                    required: "Obecne hasło jest wymagane",
                    ...passwordRules
                }}
                render={({field}) => (
                    <TextField
                        {...field}
                        label="Obecne hasło"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={!!errors.currentPassword}
                        helperText={errors.currentPassword ? errors.currentPassword.message : ''}
                    />
                )}
            />
            <Controller
                name="newPassword"
                control={control}
                rules={{
                    required: "Nowe hasło jest wymagane",
                    ...passwordRules
                }}
                render={({field}) => (
                    <TextField
                        {...field}
                        label="Nowe hasło"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={!!errors.newPassword}
                        helperText={errors.newPassword ? errors.newPassword.message : ''}
                    />
                )}
            />
            <Controller
                name="confirmPassword"
                control={control}
                rules={{
                    required: 'Powtórzone hasło jest wymagane',
                    ...passwordRules,
                    validate: (value) =>
                        value === getValues('newPassword') || 'Hasła nie są takie same',
                }}
                render={({field}) => (
                    <TextField
                        {...field}
                        label="Powtórz nowe hasło"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
                    />
                )}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{mt: 3, mb: 2}}
            >
                Aktualizuj
            </Button>
        </Box>
    );
};

export default UpdatePassword;
