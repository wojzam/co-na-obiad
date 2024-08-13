import {Box, FormControl, InputLabel, MenuItem, Select} from "@mui/material";

export default function SortInput({sort, setSort}) {
    const handleSortChange = (event) => {
        setSort(event.target.value);
    }

    return (
        <Box sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            height: 50,
            width: "100%",
            maxWidth: {xs: 600, sm: 800, md: 150},
        }}>
            <FormControl sx={{width: '100%'}}>
                <InputLabel id="sort-label">Sortowanie</InputLabel>
                <Select
                    labelId="sort-label"
                    id="sort-select"
                    value={sort}
                    label="Sortuj po"
                    onChange={handleSortChange}
                >
                    <MenuItem value="name">Nazwa</MenuItem>
                    <MenuItem value="date_desc">Od najnowszych</MenuItem>
                    <MenuItem value="date_asc">Od najstarszych</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}