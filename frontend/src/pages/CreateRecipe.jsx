import {useEffect, useState} from "react";
import {useTheme} from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {RecipeForm} from "../components/forms/RecipeForm";
import MessageBox from "../components/MessageBox";
import useAuthAxios from "../hooks/useAuthAxios";

const exceedLimitMessage = "Przekroczono limit dodanych przepisów! (maks. 100 dziennie)";

export default function CreateRecipe() {
    const theme = useTheme();
    const axiosInstance = useAuthAxios();
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        axiosInstance.get("/api/recipes/can-create",)
            .catch((error) => {
                if (error.response.status === 429) setErrorMessage(exceedLimitMessage);
                else setErrorMessage("Brak połączenia z serwerem");
            });
    }, []);

    const onSubmit = (data) => {
        setErrorMessage("");

        axiosInstance.post("/api/recipes", data, {
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then((response) => {
                window.history.pushState({url: "/user-recipes"}, "", "/user-recipes");
                window.location.href = `/recipes/${response.data._id}`;
            })
            .catch((error) => {
                if (error.response.status === 429) setErrorMessage(exceedLimitMessage);
                else setErrorMessage("Wystąpił nieoczekiwany błąd");
            });
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center",}}>
                <Typography component="h1" gutterBottom sx={{
                    fontSize: {
                        xs: theme.typography.h5.fontSize,
                        sm: theme.typography.h4.fontSize,
                    }
                }}>
                    Nowy przepis
                </Typography>
                <MessageBox message={errorMessage} isError={true}/>
                <RecipeForm onSubmit={onSubmit}/>
            </Box>
        </Container>
    );
}
