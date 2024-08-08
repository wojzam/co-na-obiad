import {Autocomplete, Box, Button, CircularProgress, Grid, TextField, Typography} from "@mui/material";
import IngredientEditList from "./IngredientEditList";
import {useCategories} from "../hooks/useCachedData";
import {Controller, useForm} from "react-hook-form";
import DeleteButton from "./DeleteButton";

export const RecipeForm = ({onSubmit, onDelete, initialData, isEdit = false}) => {
    const {register, control, handleSubmit, formState: {errors, isSubmitting}} = useForm({
        mode: "all",
        defaultValues: {
            name: initialData?.name || "",
            category: initialData?.category || "Obiad",
            comment: initialData?.comment || "",
            ingredients: initialData?.ingredients || []
        }
    });
    const categories = useCategories();

    return (
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{mt: 3}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        {...register("name", {
                            required: "Nazwa jest wymagana",
                            maxLength: {
                                value: 100,
                                message: "Nazwa nie może przekraczać 100 znaków"
                            }
                        })}
                        label="Nazwa"
                        fullWidth
                    />
                    {errors.name && (
                        <Typography component="h6" color="error" gutterBottom> {errors.name.message}</Typography>)}
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="category"
                        control={control}
                        render={({field: {onChange, value}}) => (<Autocomplete
                            disablePortal
                            value={value || null}
                            options={categories.map(category => category.name)}
                            onChange={(e, v) => onChange(v)}
                            disableClearable
                            renderInput={(params) => <TextField {...params} label="Kategoria"/>}
                        />)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        {...register("comment", {
                            maxLength: {
                                value: 10000,
                                message: "Komentarz nie może przekraczać 10000 znaków"
                            }
                        })}
                        label="Komentarz"
                        fullWidth
                        multiline
                        rows={12}
                    />
                    {errors.comment && (
                        <Typography component="h6" color="error" gutterBottom> {errors.comment.message}</Typography>)}
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5" marginTop={3} fontWeight="medium" gutterBottom>
                        Składniki:
                    </Typography>
                    <IngredientEditList control={control}/>
                </Grid>
            </Grid>
            {isSubmitting &&
                <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}> <CircularProgress/> </Box>}
            {isEdit ? <>
                <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 2, mt: 5, mb: 4}}>
                    <Button fullWidth variant="outlined" onClick={() => window.history.back()}>Anuluj</Button>
                    <Button type="submit" fullWidth variant="contained" disabled={isSubmitting}>Zapisz</Button>
                </Box>
                <DeleteButton onClick={onDelete}/>
            </> : <Button type="submit" fullWidth variant="contained" disabled={isSubmitting} sx={{mt: 5, mb: 2}}>
                Stwórz przepis
            </Button>}
        </Box>
    );
};
