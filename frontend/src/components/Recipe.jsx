import {Box, Link, Typography, useTheme} from "@mui/material";

export default function Recipe({id, name, category, ingredients, optional}) {
    const theme = useTheme();
    return (
        <Link href={`/recipes/${id}`} color="inherit" underline="none" width="100%">
            <Box
                sx={{
                    my: 2,
                    px: 5,
                    py: 2,
                    height: "100%",
                    border: "solid",
                    borderColor: "transparent",
                    borderRadius: 8,
                    background: theme.palette.neutral.main,
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                    "&:hover": {
                        background: theme.palette.neutral.darker,
                        borderColor: "#d1d1d1",
                    },
                }}
            >
                <Box display="flex" flexDirection="column" justifyContent="center">
                    <Typography
                        component="h2"
                        sx={{
                            fontSize: {
                                xs: theme.typography.h5.fontSize,
                                lg: theme.typography.h4.fontSize,
                            }
                        }}
                        fontWeight="bold"
                        align="center"
                    >
                        {name}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: {
                                xs: theme.typography.subtitle2.fontSize,
                                lg: theme.typography.subtitle1.fontSize,
                            }
                        }}
                        fontWeight="light"
                        align="center"
                    >
                        {category}
                    </Typography>
                </Box>
                <Typography
                    mt={2}
                    sx={{
                        fontSize: {
                            xs: theme.typography.body1.fontSize,
                            sm: theme.typography.body1.fontSize,
                            lg: theme.typography.h6.fontSize,
                        }
                    }}
                    align="center"
                >
                    {ingredients}
                </Typography>
                <Typography
                    mt={2}
                    sx={{
                        fontSize: {
                            xs: theme.typography.body1.fontSize,
                            sm: theme.typography.body1.fontSize,
                            lg: theme.typography.h6.fontSize,
                        }
                    }}
                    fontWeight="light"
                    align="center"
                >
                    {optional}
                </Typography>
            </Box>
        </Link>
    );
}
