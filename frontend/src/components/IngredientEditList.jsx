import React, {useEffect} from "react";
import {useIngredients, useUnits} from "../hooks/useCachedData.jsx";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import Button from "@mui/material/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {DragDropContext, Draggable, Droppable} from "@hello-pangea/dnd";
import {Controller, useFieldArray, useWatch} from "react-hook-form";

export default function IngredientEditList({control}) {
    const ingredients = useIngredients();
    const units = useUnits();
    const {fields, append, remove, move} = useFieldArray({
        control,
        name: "ingredients"
    });

    const watchedIngredients = useWatch({
        control,
        name: "ingredients",
    });

    useEffect(() => {
        if (fields.length === 0) {
            handleAddRow();
        }
    }, []);

    useEffect(() => {
        if (watchedIngredients.length > 0) {
            const lastIngredient = watchedIngredients[watchedIngredients.length - 1];
            if (lastIngredient && lastIngredient.name) {
                handleAddRow();
            }
        }
    }, [watchedIngredients]);

    const handleAddRow = () => {
        append({name: null, value: "", unit: null});
    };

    const handleRemoveRow = (index) => {
        remove(index);
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        move(result.source.index, result.destination.index);
    };

    return (
        <Box>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="ingredients">
                    {(provided) => (
                        <Table sx={{minWidth: 650}} ref={provided.innerRef} {...provided.droppableProps} size={"small"}>
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
                                                <TableCell>
                                                    <Controller
                                                        name={`ingredients[${index}].name`}
                                                        control={control}
                                                        render={({field}) => (
                                                            <Autocomplete
                                                                disablePortal
                                                                options={ingredients.map((i) => i.name)}
                                                                value={field.value || null}
                                                                sx={{ '& .MuiInputBase-root': { padding: 0.5 }, width: 200}}
                                                                onChange={(e, v) => field.onChange(v)}
                                                                renderInput={(params) => <TextField {...params} />}
                                                            />
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Controller
                                                        name={`ingredients[${index}].value`}
                                                        control={control}
                                                        render={({field}) => (
                                                            <TextField
                                                                type="number"
                                                                inputProps={{min: 0, max: 99999, style: {padding: 11.5}}}
                                                                value={field.value || ""}
                                                                sx={{ width: 100}}
                                                                onChange={(e) => field.onChange(e.target.value)}
                                                            />
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Controller
                                                        name={`ingredients[${index}].unit`}
                                                        control={control}
                                                        render={({field}) => (
                                                            <Autocomplete
                                                                options={units.map((unit) => unit.name)}
                                                                value={field.value || null}
                                                                sx={{ '& .MuiInputBase-root': { padding: 0.5 }, width: 150}}
                                                                onChange={(e, v) => field.onChange(v)}
                                                                renderInput={(params) => <TextField {...params} />}
                                                            />
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton onClick={() => handleRemoveRow(index)}>
                                                        <ClearIcon/>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </TableBody>
                        </Table>
                    )}
                </Droppable>
            </DragDropContext>
            <Button
                variant="outlined"
                startIcon={<AddCircleOutlineIcon/>}
                onClick={handleAddRow}
                sx={{mt: 2}}
            >
                Dodaj składnik
            </Button>
        </Box>
    );
}
