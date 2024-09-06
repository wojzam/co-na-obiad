import React, {useEffect, useState} from "react";
import {Autocomplete, Box, Button, CircularProgress, Grid, TextField, Typography} from "@mui/material";
import IngredientEditList from "./IngredientEditList";
import {useCategories} from "../../hooks/useCachedData";
import {Controller, FormProvider, useFieldArray, useForm, useWatch} from "react-hook-form";
import DeleteButton from "../DeleteButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const MAX_CATEGORIES = 10;
const STORAGE_KEY = "recipeFormData";

const defaultValues = (initialValues = null) => ({
    name: initialValues?.name || "",
    categories: initialValues?.categories || [],
    preparation: initialValues?.preparation || "",
    ingredientSections: initialValues?.ingredientSections || [{
        sectionName: "", ingredients: []
    }]
});

export const RecipeForm = ({onSubmit, onDelete, initialData, isEdit = false}) => {
    const methods = useForm({
        mode: "all",
        defaultValues: defaultValues(initialData)
    });
    const {control, register, handleSubmit, formState: {errors, isSubmitting}, watch, setValue} = methods;

    const {fields: sectionFields, append: appendSection, remove: removeSection} = useFieldArray({
        control,
        name: "ingredientSections"
    });

    const watchedSection = useWatch({
        control,
        name: `ingredientSections`,
    });

    const [isInitialLoad, setIsInitialLoad] = useState(false);
    const categories = useCategories();

    const handleAddSection = () => {
        appendSection({sectionName: "", ingredients: []});
    };

    const handleRemoveSection = (index) => {
        removeSection(index);
    };

    const filterData = (data) => {
        data.ingredientSections = filterIngredientSections(data);
        onSubmit(data);
    };

    function filterIngredientSections(data) {
        return data.ingredientSections.map((section) => ({
            ...section,
            ingredients: section.ingredients.map((ingredient) => {
                const filteredIngredient = {name: ingredient.name};
                if (ingredient.value || ingredient.value === 0) filteredIngredient.value = ingredient.value.trim();
                if (ingredient.unit) filteredIngredient.unit = ingredient.unit;
                if (ingredient.type) filteredIngredient.type = ingredient.type;
                return filteredIngredient;
            }).filter((ingredient) => ingredient.name),
        }));
    }

    useEffect(() => {
        const navigationEntries = performance.getEntriesByType("navigation");
        if (navigationEntries.length > 0 && navigationEntries[0].type !== "reload") {
            if (initialData) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
            else sessionStorage.removeItem(STORAGE_KEY)
        }
        setIsInitialLoad(true);
    }, []);

    useEffect(() => {
        if (isInitialLoad) loadFormValues();
    }, [setValue, isInitialLoad]);

    useEffect(() => {
        if (isInitialLoad) saveForm();
    }, [watch, isInitialLoad]);

    function loadFormValues() {
        const navigationEntries = performance.getEntriesByType("navigation");
        if (navigationEntries.length > 0 && navigationEntries[0].type === "reload") {
            const savedData = sessionStorage.getItem(STORAGE_KEY);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                Object.keys(parsedData).forEach((key) => {
                    setValue(key, parsedData[key]);
                });
            }
        }
    }

    function saveForm() {
        const subscription = watch((value) => {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        });
        return () => subscription.unsubscribe();
    }

    return (
        <FormProvider {...methods}>
            <Box component="form" noValidate onSubmit={handleSubmit(filterData)} sx={{mt: 3}}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            {...register("name", {
                                required: "Nazwa jest wymagana",
                                validate: {
                                    minLengthAfterTrim: value =>
                                        value.trim().length >= 3 || "Nazwa musi mieć co najnmiej 3 znaki"
                                },
                                maxLength: {
                                    value: 100,
                                    message: "Nazwa nie może przekraczać 100 znaków"
                                },
                                pattern: {
                                    value: /^[\p{L}0-9 @\-!.,_:(){}*#%?]+$/u,
                                    message: 'Nazwa może zawierać tylko litery, cyfry i znaki @-!.,_:(){}*#%?'
                                },
                            })}
                            label="Nazwa"
                            fullWidth
                            error={!!errors.name}
                            helperText={errors.name ? errors.name.message : ""}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="categories"
                            control={control}
                            render={({field: {onChange, value}}) => (
                                <Autocomplete
                                    multiple
                                    disablePortal
                                    value={value || []}
                                    options={categories.map(categories => categories.name)}
                                    getOptionDisabled={() => (value.length >= MAX_CATEGORIES)}
                                    filterSelectedOptions
                                    onChange={(e, v) => onChange(v)}
                                    renderInput={(params) => <TextField {...params} label="Kategorie"/>}
                                />)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            {...register("preparation", {
                                maxLength: {
                                    value: 10000,
                                    message: "Przygotowanie nie może przekraczać 10000 znaków"
                                }
                            })}
                            label="Przygotowanie"
                            fullWidth
                            multiline
                            minRows={6}
                            maxRows={20}
                            error={!!errors.preparation}
                            helperText={errors.preparation ? errors.preparation.message : ""}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h5" marginTop={3} fontWeight="medium" gutterBottom>
                            Składniki:
                        </Typography>
                        {sectionFields.map((section, index) => (
                            <Box key={section.id}>
                                <IngredientEditList sectionIndex={index} handleRemove={handleRemoveSection}/>
                            </Box>
                        ))}
                        <Button
                            variant="outlined"
                            startIcon={<AddCircleOutlineIcon/>}
                            onClick={handleAddSection}
                            fullWidth
                            disabled={watchedSection.length >= 5}
                        >
                            Dodaj sekcję składników
                        </Button>
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
        </FormProvider>
    );
};
