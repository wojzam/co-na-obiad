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

    const COLOR_LIGHTNESS = theme.palette.mode === "dark" ? 40 : 80;
    const generateColor = (saturation = 18, lightness = COLOR_LIGHTNESS) => {
        const str = category.name.trim() + category.name.trim();
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        return `hsl(${hash % 360}, ${saturation}%, ${lightness}%)`;
    }

    return (
        <Typography variant="subtitle2" fontWeight="medium" onClick={onClick} gutterBottom sx={{
            display: 'inline-block',
            backgroundColor: generateColor(),
            borderRadius: "5px",
            px: 1.5,
            whiteSpace: "nowrap",
            "&:hover": {
                background: generateColor(20, COLOR_LIGHTNESS - 10),
                boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.30)",
                cursor: "pointer"
            },
        }}>
            {category.name}
        </Typography>
    );
}

export default CategoryLink;