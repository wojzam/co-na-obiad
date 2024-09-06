import {Typography, useTheme} from "@mui/material";
import {defaultFilter, defaultSort, useSearchState} from "../hooks/useSearchState";
import {useCategories} from "../hooks/useCachedData.jsx";
import {useEffect, useState} from "react";
import {darken, lighten} from "@mui/material/styles";

const path = "/recipes";

const CategoryLink = ({category}) => {
    const theme = useTheme();
    const categories = useCategories();
    const {save} = useSearchState({id: path});

    const [color, setColor] = useState(category.color || 'rgba(0,0,0,0)');

    useEffect(() => {
        if (!categories || !categories.length) return;
        setColor(categories.find(c => c._id === category?._id)?.color);
    }, [category, categories]);

    const onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        save({filter: {...defaultFilter, categories: [category.name]}, sort: defaultSort});
        window.location.href = path;
    };

    const backgroundColor = theme.palette.mode === 'dark'
        ? darken(color, 0.2)
        : lighten(color, 0.2);

    const hoverColor = theme.palette.mode === 'dark'
        ? darken(color, 0.3)
        : darken(color, 0.2);

    return (
        <Typography
            variant="subtitle2"
            fontWeight="medium"
            onClick={onClick}
            gutterBottom
            sx={{
                display: 'inline-block',
                backgroundColor: backgroundColor,
                color: theme.palette.getContrastText(backgroundColor),
                borderRadius: "5px",
                px: 1.5,
                whiteSpace: "nowrap",
                transition: "background-color 0.3s, box-shadow 0.3s",
                "&:hover": {
                    backgroundColor: hoverColor,
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.30)",
                    cursor: "pointer",
                },
            }}
        >
            {category.name}
        </Typography>
    );
}

export default CategoryLink;
