import {useRef, useState} from "react";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import MessageBox from "../components/MessageBox";
import ReCAPTCHA from "react-google-recaptcha";
import {useForm} from "react-hook-form";
import {CircularProgress} from "@mui/material";
import axios from "axios";

export default function SignUp() {
    const {register, handleSubmit, setError, formState: {errors, isSubmitting}, getValues, reset} = useForm({
        mode: "all",
        defaultValues: {username: "", password: "", passwordRepeated: ""}
    });
    const captchaRef = useRef(null)
    const [message, setMessage] = useState("");

    const onSubmit = (data) => {
        setMessage("");
        const captchaToken = captchaRef.current.getValue();
        if (!captchaToken) {
            setError("root", {message: "Proszę wykonać weryfikację reCAPTCHA"});
            return;
        }

        axios.post("/api/auth/register", {
            username: data.username,
            password: data.password,
            token: captchaToken
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                setMessage("Konto utworzone, oczekiwanie na aktywację przez administratora");
                captchaRef.current.reset();
                reset();
            })
            .catch((error) => {
                if (error.response.status === 409) {
                    setError("username", {message: "Nazwa użytkownika jest już zajęta"});
                } else if (error.response.status === 429) {
                    setError("root", {message: "Za dużo prób spróbuj ponownie później"});
                } else {
                    setError("root", {message: "Wystąpił nieoczekiwany błąd"});
                }
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
                    Rejestracja
                </Typography>
                <MessageBox message={message}/>
                <MessageBox message={errors.root} isError={true}/>
                <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                {...register("username", {
                                    required: "Nazwa użytkownika jest wymagana",
                                    validate: {
                                        minLengthAfterTrim: value =>
                                            value.trim().length >= 3 || "Nazwa użytkownika musi mieć co najmniej 3 znaki"
                                    },
                                    maxLength: {
                                        value: 20,
                                        message: "Nazwa użytkownika nie może przekraczać 20 znaków"
                                    },
                                    pattern: {
                                        value: /^[a-zA-Z0-9 @\-!._:*#%?ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/,
                                        message: 'Nazwa użytkownika może zawierać tylko litery, cyfry i znaki @-!._:*#%?'
                                    },
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
                                    required: "Hasło jest wymagane",
                                    minLength: {
                                        value: 8,
                                        message: "Hasło musi mieć przynajmniej 8 znaków"
                                    },
                                    maxLength: {
                                        value: 64,
                                        message: "Hasło nie może przekraczać 64 znaków"
                                    }
                                })}
                                label="Hasło"
                                fullWidth
                                type="password"
                                autoComplete="new-password"
                                error={!!errors.password}
                                helperText={errors.password ? errors.password.message : ""}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                {...register("passwordRepeated", {
                                    required: "Powtórzone hasło jest wymagane",
                                    validate: value =>
                                        value === getValues("password") || "Hasła nie są takie same"
                                })}
                                label="Powtórz hasło"
                                fullWidth
                                type="password"
                                error={!!errors.passwordRepeated}
                                helperText={errors.passwordRepeated ? errors.passwordRepeated.message : ""}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="center">
                                <ReCAPTCHA sitekey={import.meta.env.VITE_CAPTCHA_SITE_KEY} ref={captchaRef}/>
                            </Box>
                        </Grid>
                    </Grid>
                    {isSubmitting &&
                        <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}> <CircularProgress/> </Box>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{mt: 3, mb: 2}}
                    >
                        Zarejestruj się
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Masz już konto? Zaloguj się
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}