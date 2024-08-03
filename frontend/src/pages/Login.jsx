import {useState} from "react";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import useAuthData from "../hooks/useAuthData";
import {useForm} from "react-hook-form";
import {TextField} from "@mui/material";
import {ReCaptchaV3} from "../components/ReCaptchaV3.jsx";

export default function Login() {
    const {login} = useAuthData();
    const {register, control, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {username: "", password: ""}
    });
    const [captchaToken, setCaptchaToken] = useState("");

    const onSubmit = (data) => {
        if (!captchaToken) return;
        fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: data.username,
                password: data.password,
                token: captchaToken
            }),
        })
            .then((response) => {
                if (response.status === 401) {
                    throw new Error("Niepoprawna nazwa użytkownika lub hasło");
                }
                if (!response.ok) {
                    return response.text().then((text) => {
                        throw new Error(Object.values(JSON.parse(text)).join(", "));
                    });
                }
                return response.json();
            })
            .then((data) => {
                login(data);
                window.location.href = `/user-recipes`;
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h4" gutterBottom>
                    Logowanie
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                {...register("username", {
                                    required: "Nazwa użytkownika jest wymagana"
                                })}
                                label="Nazwa użytkownika"
                                fullWidth
                            />
                            {errors.username && (
                                <Typography component="h6" color="error"
                                            gutterBottom> {errors.username.message}</Typography>)}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                {...register("password", {
                                    required: "Hasło jest wymagane"
                                })}
                                fullWidth
                                label="Hasło"
                                type="password"
                                autoComplete="new-password"
                            />
                            {errors.password && (
                                <Typography component="h6" color="error"
                                            gutterBottom> {errors.password.message}</Typography>)}
                        </Grid>
                    </Grid>
                    <ReCaptchaV3 setToken={setCaptchaToken}/>
                    <Button type="submit" fullWidth variant="contained" sx={{mt: 3, mb: 2}}>
                        Zaloguj
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/signup" variant="body2">
                                Nie masz konta? Zarejetruj się
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
