import { useState } from "react";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import ValidatedTextField from "../components/ValidatedTextField";

export default function Login() {
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    fetch("/api/auth/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: data.get("username"),
        password: data.get("password"),
      }),
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error("Incorrect username or password");
        }
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(Object.values(JSON.parse(text)).join(", "));
          });
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.token);
        window.location.href = `/userTopics`;
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
          Login
        </Typography>
        {errorMessage && (
          <Typography component="h5" variant="h5" color="error" gutterBottom>
            {errorMessage}
          </Typography>
        )}
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ValidatedTextField
                id="username"
                name="username"
                label="Username"
                maxLength={64}
              />
            </Grid>
            <Grid item xs={12}>
              <ValidatedTextField
                id="password"
                name="password"
                label="Password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={64}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/signup" variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
