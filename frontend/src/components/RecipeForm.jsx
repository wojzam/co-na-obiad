import {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import ValidatedTextField from "./ValidatedTextField";

export const RecipeForm = ({handleSubmit, selectedCategory, setSelectedCategory}) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch("/api/recipes/categories")
            .then((response) => response.json())
            .then((data) => {
                setCategories(data);
            });
    }, []);

    return (
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
            <Grid container spacing={2} sx={{mb: 2}}>
                <Grid item xs={12}>
                    <ValidatedTextField
                        id="name"
                        label="Nazwa"
                        name="name"
                        maxLength={50}
                    />
                </Grid>
                <Grid item xs={12}>
                    <ValidatedTextField
                        name="comment"
                        label="Komentarz"
                        id="comment"
                        multiline
                        rows={5}
                        minLength={0}
                        maxLength={1000}
                        required={false}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        disablePortal
                        id="category"
                        value={selectedCategory.name}
                        defaultValue={"Obiad"}
                        options={categories.map(category => category.name)}
                        onChange={(e, v) => setSelectedCategory(v)}
                        disableClearable
                        renderInput={(params) => <TextField {...params} label="Kategoria"/>}
                    />
                </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{mt: 5, mb: 2}}>
                Create
            </Button>
        </Box>
    );
};
