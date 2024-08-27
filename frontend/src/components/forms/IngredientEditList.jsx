import React, {useEffect} from "react";
import {useIngredients, useUnits} from "../../hooks/useCachedData";
import {useFieldArray, useFormContext, useWatch} from "react-hook-form";
import {DragDropContext, Draggable, Droppable} from "@hello-pangea/dnd";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {Chip, Divider, Paper, useMediaQuery} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import AddIcon from '@mui/icons-material/Add';
import IngredientValueUnit from "./IngredientValueUnit";

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
        handleAddRowWithType("")
    };

    const handleAddRowWithType = (type = "") => {
        if (type !== "") {
            const lastIndex = watchedIngredients.length - 1;
            if (!watchedIngredients[lastIndex].name && watchedIngredients[lastIndex].type === "") remove(lastIndex);
        }
        if (watchedIngredients.length < MAX_LENGTH) {
            append({name: null, value: "", unit: null, type: type});
        }
    };

    const handleRemoveRow = (index) => {
        remove(index);
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        move(result.source.index, result.destination.index);
    };

    const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));

    useEffect(() => {
        if (watchedIngredients.length === 0) {
            handleAddRow();
        }
    }, []);

    return (
        <Paper sx={{mb: 4}}>
            <Box display={sectionIndex > 0 ? 'flex' : 'none'} pt={3} px={2} mt={5}
                 mb={2}>
                <TextField
                    {...register(`ingredientSections[${sectionIndex}].sectionName`, {
                        required: sectionIndex > 0 && "Nazwa sekcji jest wymagana",
                        maxLength: {
                            value: 64,
                            message: "Nazwa sekcji nie może przekraczać 64 znaków"
                        },
                        pattern: {
                            value: /^[a-zA-Z0-9 @\-!._:*#%?ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/,
                            message: 'Nazwa sekcji może zawierać tylko litery, cyfry i znaki @-!._:*#%?'
                        },
                    })}
                    sx={{mr: 2}}
                    label="Nazwa sekcji"
                    fullWidth
                    error={!!errors?.ingredientSections?.[sectionIndex]?.sectionName}
                    helperText={errors?.ingredientSections?.[sectionIndex]?.sectionName?.message ?? ""}
                />
                <Button
                    variant="text"
                    startIcon={<DeleteOutlineIcon/>}
                    onClick={() => handleRemove(sectionIndex)}
                    sx={{width: "fit-content", whiteSpace: "nowrap", px: 3}}
                    color="error"
                >
                    {isSmallScreen ? "Usuń" : "Usuń sekcję"}
                </Button>
            </Box>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="ingredients">
                    {(provided) => (
                        <Table ref={provided.innerRef} {...provided.droppableProps} size={"small"}>
                            <TableHead>
                                <TableRow>
                                    {isSmallScreen ? (<>
                                        <TableCell></TableCell>
                                        <TableCell align="right"></TableCell>
                                        <TableCell align="right"></TableCell>
                                    </>) : (<>
                                        <TableCell sx={{minWidth: {sm: 200, md: 240, lg: 300}}}> Nazwa < /TableCell>
                                        <TableCell sx={{minWidth: {sm: 100, md: 115}}}>Wartość</TableCell>
                                        <TableCell sx={{minWidth: {sm: 150, md: 200, lg: 210}}}>Jednostka</TableCell>
                                        <TableCell align="right"></TableCell>
                                        <TableCell align="right"></TableCell>
                                    </>)}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {fields.map((field, index) => (
                                    <React.Fragment key={field.id}>
                                        <Draggable draggableId={field.id} index={index}>
                                            {(provided) => (
                                                <>
                                                    <TableRow>
                                                        <TableCell colSpan={5}>
                                                            {field.type === "alt" &&
                                                                <Divider> <Chip label="LUB" size="small"/></Divider>}
                                                            {field.type === "opt" &&
                                                                <Divider> <Chip label="OPCJONALNIE"
                                                                                size="small"/></Divider>}
                                                        </TableCell>
                                                    </TableRow>
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
                                                        }} name={`ingredientSections[${sectionIndex}].ingredients[${index}]`}
                                                        />
                                                        <TableCell align="right"
                                                                   sx={{padding: isSmallScreen ? "8px 1px" : "6px 6px"}}>
                                                            <DragHandleIcon/>
                                                        </TableCell>
                                                        <TableCell align="right"
                                                                   sx={{padding: isSmallScreen ? "8px 0px" : "6px 6px"}}>
                                                            <IconButton onClick={() => handleRemoveRow(index)}
                                                                        sx={{display: watchedIngredients.length === 1 ? "none" : "block"}}>
                                                                <ClearIcon/>
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                </>
                                            )}
                                        </Draggable>
                                    </React.Fragment>
                                ))}
                                {provided.placeholder}
                            </TableBody>
                        </Table>
                    )}
                </Droppable>
            </DragDropContext>
            <Box px={2} py={3}>
                <Box display="flex" justifyContent="center">
                    <Button
                        variant="outlined"
                        startIcon={<AddCircleOutlineIcon/>}
                        onClick={handleAddRow}
                        fullWidth
                        disabled={watchedIngredients.length >= MAX_LENGTH}
                        sx={{fontSize: 15}}
                    >
                        Dodaj składnik
                    </Button>
                </Box>
                <Box display="flex" justifyContent="center" flexDirection={{xs: "column", sm: "row", md: "row"}}
                     gap={2} pt={2}>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon/>}
                        onClick={() => handleAddRowWithType("alt")}
                        fullWidth
                        disabled={watchedIngredients.length >= MAX_LENGTH}
                    >
                        Alternatywny składnik
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon/>}
                        onClick={() => handleAddRowWithType("opt")}
                        fullWidth
                        disabled={watchedIngredients.length >= MAX_LENGTH}
                    >
                        Opcjonalny składnik
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
}
