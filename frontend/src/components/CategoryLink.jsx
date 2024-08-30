import {Typography, useTheme} from "@mui/material";
import {defaultFilter, defaultSort, useSearchState} from "../hooks/useSearchState";

const path = "/recipes";

const CategoryLink = ({category}) => {
    const theme = useTheme();
    const {save} = useSearchState({id: path});

    const onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        save({filter: {...defaultFilter, categories: [category.name]}, sort: defaultSort});
        window.location.href = path;
    };

    return (
        <Typography variant="subtitle2" fontWeight="medium" onClick={onClick} gutterBottom sx={{
            display: 'inline-block',
            backgroundColor: theme.palette.lightGrey.main,
            borderRadius: "5px",
            px: 1.5,
            whiteSpace: "nowrap",
            "&:hover": {
                background: theme.palette.neutral.darker,
                boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.30)",
                cursor: "pointer"
            },
        }}>
            {category.name}
        </Typography>
    );
}

export default CategoryLink;