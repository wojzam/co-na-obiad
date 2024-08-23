import {Typography, useTheme} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {defaultFilter, defaultSort, useSearchState} from "../hooks/useSearchState";

const path = "/recipes";

const CategoryLink = ({category}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const {save} = useSearchState({id: path});

    const onClick = () => {
        save({filter: {...defaultFilter, categories: [category.name]}, sort: defaultSort});
        navigate(path);
    };

    return (
        <Typography fontWeight="regular" onClick={onClick} gutterBottom sx={{
            display: 'inline-block',
            backgroundColor: theme.palette.lightGrey.main,
            borderRadius: "5px",
            px: 1.5,
            whiteSpace: "nowrap",
            fontSize: {
                xs: theme.typography.subtitle2.fontSize,
                lg: theme.typography.subtitle1.fontSize,
            },
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