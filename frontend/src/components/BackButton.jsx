import React from "react";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {Button} from "@mui/material";

export default function BackButton() {
    const goBack = () => {
        window.history.back();
    };

    return (
        <Button onClick={goBack} startIcon={<ArrowBackIosIcon/>} sx={{
            '& .MuiButton-startIcon': {
                marginRight: '0px',
            },
        }}>
            Wróć
        </Button>
    );
}
