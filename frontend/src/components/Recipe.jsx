import {Box, Divider, Link, Typography, useTheme} from "@mui/material";
import truncateText from "../utils/truncateText";

const maxTextLength = 200;
const maxCreatorNameLength = 40;

export default function Recipe({id, name, categories, ingredients, additionalIngredients, creator}) {
    const theme = useTheme();
    return (
        <Link href={`/recipes/${id}`} color="inherit" underline="none" width="100%">
            <Box display="flex" justifyContent="space-between" flexDirection="column"
                 sx={{
                     mt: 2,
                     mb: {xs: 0, sm: 0.5},
                     px: 5,
                     pt: {xs: 1.5, sm: 2},
                     pb: {xs: 1, sm: 1.5},
                     height: "100%",
                     borderRadius: 8,
                     background: theme.palette.neutral.main,
                     boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                     "&:hover": {
                         background: theme.palette.neutral.darker,
                         boxShadow: "3px 9px 12px rgba(0, 0, 0, 0.50)",
                     },
                 }}>
                <Box>
                    <Box display="flex" flexDirection="column" justifyContent="center">
                        <Typography
                            component="h2"
                            sx={{
                                fontSize: {
                                    xs: theme.typography.h6.fontSize,
                                    lg: theme.typography.h5.fontSize,
                                },
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                            }}
                            fontWeight="bold"
                            align="center"
                            gutterBottom
                        >
                            {name}
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center">
                            {categories.split(',').map((category, index) => (
                                <Typography
                                    key={index}
                                    variant="subtitle2"
                                    sx={{
                                        display: 'inline-block',
                                        backgroundColor: theme.palette.lightGrey.main,
                                        borderRadius: "5px",
                                        px: 1.5,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {category}
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                    <Typography mt={2} variant="subtitle2" align="center">
                        {truncateText(ingredients, maxTextLength)}
                    </Typography>
                    <Typography mt={0.5} variant="subtitle2" fontWeight="light" align="center">
                        {truncateText(additionalIngredients, maxTextLength)}
                    </Typography>
                </Box>
                <Box display="flex" alignItems="center" flexDirection="column">
                    <Divider sx={{width: "90%"}}>
                        <Typography variant="subtitle2" fontWeight="lighter" align="center"
                                    sx={{
                                        wordBreak: 'break-word',
                                        overflowWrap: 'break-word',
                                    }}>
                            {truncateText(creator, maxCreatorNameLength)}
                        </Typography>
                    </Divider>
                </Box>
            </Box>
        </Link>
    );
}
