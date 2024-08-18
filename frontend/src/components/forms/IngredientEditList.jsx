import React, {useEffect} from "react";
import {useIngredients, useUnits} from "../../hooks/useCachedData";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {DragDropContext, Draggable, Droppable} from "@hello-pangea/dnd";
import {useFieldArray, useFormContext, useWatch} from "react-hook-form";
import {Paper} from "@mui/material";
import IngredientValueUnit from "./IngredientValueUnit";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";

const MAX_LENGTH = 30;

export default function IngredientEditList({sectionIndex, handleRemove}) {
    const ingredients = useIngredients();
    const units = useUnits();
    const {register, control, formState: {errors}} = useFormContext();
    const {fields, append, remove, move} = useFieldArray({
        control,
        name: `ingredientSections[${sectionIndex}].ingredients`
    });

    const watchedIngredients = useWatch({
        control,
        name: `ingredientSections[${sectionIndex}].ingredients`,
    });

    const handleAddRow = () => {
        if (watchedIngredients.length < MAX_LENGTH) {
            append({name: null, value: "", unit: null});
        }
    };

    const handleRemoveRow = (index) => {
        remove(index);
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        move(result.source.index, result.destination.index);
    };

    useEffect(() => {
        if (watchedIngredients.length === 0) {
            handleAddRow();
        }
    }, []);

    return (
        <Paper sx={{mb: 4}}>
            <Box display={sectionIndex > 0 ? 'flex' : 'none'} justifyContent="center" gap={10} pt={3} px={2} mt={5}
                 mb={2}>
                <TextField
                    {...register(`ingredientSections[${sectionIndex}].sectionName`, {
                        required: sectionIndex > 0 && "Nazwa sekcji jest wymagana",
                        maxLength: {
                            value: 100,
                            message: "Nazwa sekcji nie może przekraczać 100 znaków"
                        }
                    })}
                    label="Nazwa sekcji"
                    fullWidth
                    error={!!errors?.ingredientSections?.[sectionIndex]?.sectionName}
                    helperText={errors?.ingredientSections?.[sectionIndex]?.sectionName?.message ?? ""}
                />
                <Button
                    variant="text"
                    startIcon={<DeleteOutlineIcon/>}
                    onClick={() => handleRemove(sectionIndex)}
                    sx={{flexGrow: 1, minWidth: 150}}
                    color="error"
                >
                    Usuń sekcję
                </Button>
            </Box>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="ingredients">
                    {(provided) => (
                        <Table ref={provided.innerRef} {...provided.droppableProps} size={"small"}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nazwa</TableCell>
                                    <TableCell align="right">Wartość</TableCell>
                                    <TableCell align="right">Jednostka</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {fields.map((field, index) => (
                                    <Draggable key={field.id} draggableId={field.id} index={index}>
                                        {(provided) => (
                                            <TableRow
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <IngredientValueUnit {...{
                                                    ingredients,
                                                    units,
                                                    watchedIngredients,
                                                    handleAddRow
                                                }}
                                                                     name={`ingredientSections[${sectionIndex}].ingredients[${index}]`}
                                                />
                                                <TableCell align="right">
                                                    <IconButton onClick={() => handleRemoveRow(index)}>
                                                        <ClearIcon/>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>)}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </TableBody>
                        </Table>
                    )}
                </Droppable>
            </DragDropContext>
            <Box display="flex" justifyContent="center" px={2} py={3}>
                <Button
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon/>}
                    onClick={handleAddRow}
                    fullWidth
                    disabled={watchedIngredients.length >= MAX_LENGTH}
                >
                    Dodaj składnik
                </Button>
            </Box>
        </Paper>
    );
}
