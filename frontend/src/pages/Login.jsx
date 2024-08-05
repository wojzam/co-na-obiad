import {useState} from "react";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import useAuthData from "../hooks/useAuthData";
import {useForm} from "react-hook-form";
import {CircularProgress, TextField} from "@mui/material";
import {ReCaptchaV3} from "../components/ReCaptchaV3.jsx";
import MessageBox from "../components/MessageBox.jsx";
import axios from "axios";

export default function Login() {
    const {login} = useAuthData();
    const {register, control, handleSubmit, setError, formState: {errors, isSubmitting}} = useForm({
        mode: "all",
        defaultValues: {username: "", password: ""}
    });
    const [captchaToken, setCaptchaToken] = useState("");
    const [message, setMessage] = useState("");

    const onSubmit = (data) => {
        setMessage("");
        if (!captchaToken) {
            setMessage("Oczekiwanie na automatyczną weryfikację reCAPTCHA")
            return;
        }

        axios.post('/api/auth/login', {
            username: data.username,
            password: data.password,
            token: captchaToken
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                login(response.data);
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    setError("root", {message: "Niepoprawna nazwa użytkownika lub hasło"})
                } else if (error.response.status === 403) {
                    setMessage("Konto istnieje, ale oczekuje na aktywację przez administratora");
                } else {
                    setError("root", {message: "Wystąpił nieoczekiwany błąd"})
                }
            });
    }

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
                <MessageBox message={message}/>
                <MessageBox message={errors.root} isError={true}/>
                <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                {...register("username", {
                                    required: "Nazwa użytkownika jest wymagana"
                                })}
                                label="Nazwa użytkownika"
                                fullWidth
                                error={!!errors.username}
                                helperText={errors.username ? errors.username.message : ""}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                {...register("password", {
                                    required: "Hasło jest wymagane"
                                })}
                                label="Hasło"
                                fullWidth
                                type="password"
                                autoComplete="new-password"
                                error={!!errors.password}
                                helperText={errors.password ? errors.password.message : ""}
                            />
                        </Grid>
                    </Grid>
                    <ReCaptchaV3 setToken={setCaptchaToken}/>
                    {isSubmitting &&
                        <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}> <CircularProgress/> </Box>}
                    <Button type="submit" fullWidth variant="contained" disabled={isSubmitting} sx={{mt: 3, mb: 2}}>
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
