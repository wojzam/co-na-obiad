import React, {useState} from "react";
import {Button} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ConfirmationDialog from "./ConfirmationDialog.jsx";

export default function DeleteButton({onClick}) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <>
            <Button fullWidth variant="outlined" startIcon={<DeleteOutlinedIcon/>} color={"error"} onClick={handleOpen}>
                Usuń przepis
            </Button>
            <ConfirmationDialog open={open} setOpen={setOpen} onConfirm={onClick}/>
        </>
    );
}
