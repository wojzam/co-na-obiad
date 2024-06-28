import {useState} from "react";
import {Box, Button, IconButton, Typography} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import RecipeEditDialog from "./RecipeEditDialog.jsx";
import ConfirmationDialog from "../components/ConfirmationDialog";

export default function RecipeControlPanel({
                                               recipeData,
                                               setRecipeData
                                           }) {
    const [generateReady, setGenerateReady] = useState(false);
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

    const handleGenerateClick = () => {
        const token = localStorage.getItem("token");
        fetch(`/api/recipe/${recipeData.id}/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    };

    const handleDelete = () => {
        const token = localStorage.getItem("token");
        fetch(`/api/recipe/${recipeData.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }).then(() => {
            window.location.href = `/userRecipes`;
        });
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight="regular" noWrap>
            </Typography>
            {recipeData && recipeData.canEdit && (
                <Box display="flex" justifyContent="space-between" my={1}>
                    <Button
                        onClick={handleGenerateClick}
                        variant="outlined"
                        disabled={!generateReady}
                    >
                        {generateReady ? "Generate" : "Pending"}
                    </Button>
                    <RecipeEditDialog
                        {...{
                            id: recipeData.id,
                            title: recipeData.title,
                            description: recipeData.description,
                            category: recipeData.category,
                            publicVisibility: recipeData.publicVisibility,
                            setRecipeData,
                        }}
                    />
                    <IconButton onClick={() => setOpenConfirmationDialog(true)}>
                        <DeleteOutlinedIcon/>
                    </IconButton>
                    <ConfirmationDialog
                        open={openConfirmationDialog}
                        setOpen={setOpenConfirmationDialog}
                        onConfirm={handleDelete}
                    />
                </Box>
            )}
        </Box>
    );
}
