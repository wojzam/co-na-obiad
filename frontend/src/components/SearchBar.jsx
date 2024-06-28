import {useState} from "react";
import {IconButton, InputBase, Paper} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({setRecipes}) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearch = (event) => {
        event.preventDefault();
        const endpoint = `/api/recipes?name=${searchQuery}`;
        const token = localStorage.getItem("token");

        fetch(endpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setRecipes(data);
            });
    };

    return (
        <Paper
            component="form"
            sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                height: 50,
                width: 300,
            }}
        >
            <InputBase
                sx={{ml: 1, flex: 1}}
                placeholder="Szukaj.."
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
