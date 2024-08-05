import {useRef} from "react";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import ReCAPTCHA from "react-google-recaptcha";
import useAuthData from "../hooks/useAuthData";
import {useForm} from "react-hook-form";
import {CircularProgress} from "@mui/material";

export default function SignUp() {
    const {login} = useAuthData();
    const {register, handleSubmit, setError, formState: {errors, isSubmitting}, getValues} = useForm({
        mode: "all",
        defaultValues: {username: "", password: "", passwordRepeated: ""}
    });
    const captchaRef = useRef(null)

    const onSubmit = (data) => {
        const captchaToken = captchaRef.current.getValue();
        captchaRef.current.reset();

        fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: data.username,
                password: data.password,
                token: captchaToken,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((text) => {
                        throw new Error(Object.values(JSON.parse(text)).join(", "));
                    });
                }
                return response.json();
            })
            .then((data) => {
                login(data);
            })
            .catch((error) => {
                console.log(error);
                setError("username", {
                    message: "Nazwa użytkownika jest już zajęta"
                })
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
                <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                {...register("username", {
                                    required: "Nazwa użytkownika jest wymagana",
                                    maxLength: {
                                        value: 64,
                                        message: "Nazwa użytkownika nie może przekraczać 64 znaków"
                                    }
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