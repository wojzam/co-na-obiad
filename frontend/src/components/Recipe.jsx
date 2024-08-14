import {Box, Link, Typography, useTheme} from "@mui/material";
import truncateText from "../utils/truncateText";

const maxTextLength = 200;

export default function Recipe({id, name, categories, ingredients, additionalIngredients}) {
    const theme = useTheme();
    return (
        <Link href={`/recipes/${id}`} color="inherit" underline="none" width="100%">
            <Box
                sx={{
                    my: 2,
                    px: 5,
                    py: 2,
                    height: "100%",
                    borderRadius: 8,
                    background: theme.palette.neutral.main,
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                    "&:hover": {
                        background: theme.palette.neutral.darker,
                        boxShadow: "3px 9px 12px rgba(0, 0, 0, 0.50)",
                    },
                }}
            >
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
                                    backgroundColor: "lightgray",
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
                <Typography
                    mt={2}
                    sx={{
                        fontSize: {
                            xs: theme.typography.body2.fontSize,
                            sm: theme.typography.body2.fontSize,
                            lg: theme.typography.body1.fontSize,
                        }
                    }}
                    align="center"
                >
                    {truncateText(ingredients, maxTextLength)}
                </Typography>
                <Typography
                    mt={2}
                    sx={{
                        fontSize: {
                            xs: theme.typography.body2.fontSize,
                            sm: theme.typography.body2.fontSize,
                            lg: theme.typography.body1.fontSize,
                        }
                    }}
                    fontWeight="light"
                    align="center"
                >
                    {truncateText(additionalIngredients, maxTextLength)}
                </Typography>
            </Box>
        </Link>
    );
}
