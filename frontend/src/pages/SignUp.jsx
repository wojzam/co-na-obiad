import {useRef, useState} from "react";
import {useCookies} from "react-cookie";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import ValidatedTextField from "../components/ValidatedTextField";
import ReCAPTCHA from "react-google-recaptcha";

export default function SignUp() {
    const [cookies, setCookie] = useCookies(["token"]);
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const captchaRef = useRef(null)

    const handlePasswordsChange = (e) => {
        const password = e.target.form.password.value;
        const passwordRepeated = e.target.form.passwordRepeated.value;
        setPasswordErrorMessage(
            password !== passwordRepeated ? "Hasła nie są identyczne" : ""
        );
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username = data.get("username")
        const password = data.get("password");
        const passwordRepeated = data.get("passwordRepeated");
        const captchaToken = captchaRef.current.getValue();
        captchaRef.current.reset();

        if (username.trim() === "") {
            setErrorMessage("Nazwa użytkownika jest wymagana");
            return;
        }

        if (passwordRepeated.trim() === "") {
            setErrorMessage("Powtórzone hasło jest wymagane");
            return;
        }

        if (password !== passwordRepeated) {
            setPasswordErrorMessage("Hasła nie są identyczne");
            return;
        }

        fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                token: captchaToken,
                password: password,
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
                setCookie("token", data.token, {path: "/"});
                window.location.href = `/userRecipes`;
            })
            .catch((error) => {
                setErrorMessage(error.message);
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
                {errorMessage && (
                    <Typography component="h5" variant="h5" color="error" gutterBottom>
                        {errorMessage}
                    </Typography>
                )}
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <ValidatedTextField
                                id="username"
                                label="Nazwa użytkownika"
                                name="username"
                                maxLength={64}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <ValidatedTextField
                                name="password"
                                label="Hasło"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                onChange={handlePasswordsChange}
                                minLength={8}
                                maxLength={64}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="passwordRepeated"
                                label="Powtórz hasło"
                                type="password"
                                id="passwordRepeated"
                                error={passwordErrorMessage !== ""}
                                helperText={passwordErrorMessage}
                                onChange={handlePasswordsChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="center">
                                <ReCAPTCHA sitekey={import.meta.env.VITE_CAPTCHA_SITE_KEY} ref={captchaRef}/>
                            </Box>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
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