import {useEffect, useState} from "react";
import {IconButton, InputBase, Paper} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({initialQuery, onFilterChange}) {
    const [searchQuery, setSearchQuery] = useState(initialQuery);

    useEffect(() => {
        setSearchQuery(initialQuery);
    }, [initialQuery]);

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
        onFilterChange({name: event.target.value});
    };

    const handleSearch = (event) => {
        event.preventDefault();
        onFilterChange({name: searchQuery}); //TODO  Warning: Cannot update a component (`App`) while rendering a different component (`RecipesFetcher`).
    };

    return (
        <Paper
            component="form"
            sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                height: 50,
                width: "auto",
                minWidth: 200
            }}
        >
            <InputBase
                sx={{ml: 1, flex: 1}}
                placeholder="Szukaj po nazwie.."
                label="Szukaj"
                value={searchQuery}
                onChange={handleInputChange}
            />
            <IconButton type="submit" sx={{p: "10px"}} onClick={handleSearch}>
                <SearchIcon/>
            </IconButton>
        </Paper>
    );
}
