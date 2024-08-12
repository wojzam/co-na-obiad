import {Controller, useForm} from "react-hook-form";
import {Box, Button, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import useAuthData from "../hooks/useAuthData.jsx";
import useAuthAxios from "../hooks/useAuthAxios.jsx";
import MessageBox from "./MessageBox.jsx";
import {useCookies} from "react-cookie";

const UpdateUsername = () => {
    const [cookies, setCookie] = useCookies(['user']);
    const axiosInstance = useAuthAxios();
    const {username} = useAuthData();
    const [message, setMessage] = useState("");
    const {handleSubmit, control, setError, formState: {errors}} = useForm({
        mode: "all",
        defaultValues: {
            username: username,
        }
    });

    const onSubmit = (data) => {
        setMessage("");
        if (data.username === username) return;

        axiosInstance.put("/api/users/update-username", data, {
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then((response) => {
                setCookie('user', response.data, {path: '/'});
                setMessage("Zmieniono nazwę użytkownika")
            })
            .catch((error) => {
                if (error.response.status === 409) {
                    setError("username", {message: "Nazwa użytkownika jest już zajęta"});
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
            <Typography component="h2" variant="h5" gutterBottom> Zmień nazwę użytkownika </Typography>
            <MessageBox message={message}/>
            <MessageBox message={errors.root} isError={true}/>
            <Controller
                name="username"
                control={control}
                rules={{
                    required: 'Nazwa użytkownika jest wymagana',
                    maxLength: {
                        value: 64,
                        message: "Nazwa użytkownika nie może przekraczać 64 znaków"
                    }
                }}
                render={({field}) => (
                    <TextField
                        {...field}
                        label="Nazwa użytkownika"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={!!errors.username}
                        helperText={errors.username ? errors.username.message : ''}
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
}

export default UpdateUsername;