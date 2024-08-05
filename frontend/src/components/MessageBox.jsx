import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {useTheme} from "@mui/material";

export default function MessageBox({message, isError = false}) {
    const theme = useTheme();

    return message && <Box
        sx={{
            backgroundColor: isError ? "" : theme.palette.neutral.darker,
            border: '2px solid',
            borderColor: isError ? theme.palette.error.main : "black",
            borderRadius: '8px',
            padding: '12px',
            width: '100%'
        }}
        display="flex"
        justifyContent="center"
        alignItems="center">
        <Typography variant="button" align="center" color={isError && theme.palette.error.main}>
            <b>{message.message ? message.message : message}</b>
        </Typography>
    </Box>
}