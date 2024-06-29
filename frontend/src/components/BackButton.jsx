import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {IconButton, Typography} from "@mui/material";

export default function BackButton() {
    const goBack = () => {
        window.history.back();
    };

    return (
        <IconButton onClick={goBack}>
            <ArrowBackIcon/>
            <Typography variant="h6">Wróć</Typography>
        </IconButton>
    );
}
