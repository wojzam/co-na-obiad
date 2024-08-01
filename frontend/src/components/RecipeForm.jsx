import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import IngredientEditList from "./IngredientEditList.jsx";
import {useCategories} from "../hooks/useCachedData.jsx";
import {Controller, useForm} from "react-hook-form";

export const RecipeForm = ({onSubmit}) => {
    const {register, control, handleSubmit, formState: {errors}} = useForm();
    const categories = useCategories();

    return (<Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{mt: 3}}>
        <Grid container spacing={2} sx={{mb: 2}}>
            <Grid item xs={12}>
                <TextField
                    {...register("name", {
                        required: "Nazwa jest wymagana"
                    })}
                    label="Nazwa"
                    fullWidth
                />
                {errors.name && (
                    <Typography component="h6" color="error" gutterBottom> {errors.name.message}</Typography>
                )}
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name="category"
                    control={control}
                    defaultValue="Obiad"
                    render={({field: {onChange, value}}) => (
                        <Autocomplete
                            disablePortal
                            value={value || null}
                            options={categories.map(category => category.name)}
                            onChange={(e, v) => onChange(v)}
                            disableClearable
                            renderInput={(params) => <TextField {...params} label="Kategoria"/>}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    {...register("comment")}
                    label="Komentarz"
                    fullWidth
                    multiline
                    rows={6}
                />
                {errors.comment && (
                    <Typography component="h6" color="error" gutterBottom> {errors.comment.message}</Typography>
                )}
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h5" marginTop={3} fontWeight="medium" gutterBottom>
                    Składniki:
                </Typography>
                <IngredientEditList control={control}/>
            </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" sx={{mt: 5, mb: 2}}>
            Stwórz przepis
        </Button>
    </Box>);
};
