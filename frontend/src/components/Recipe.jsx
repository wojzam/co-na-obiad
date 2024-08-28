import {Box, Divider, Link, Typography, useTheme} from "@mui/material";
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import truncateText from "../utils/truncateText";

const maxTextLength = 200;

export default function Recipe({id, name, categories, ingredients, additionalIngredients, creator, comments}) {
    const theme = useTheme();
    return (
        <Link href={`/recipes/${id}`} color="inherit" underline="none" width="100%">
            <Box display="flex" justifyContent="space-between" flexDirection="column"
                 sx={{
                     mt: 2,
                     mb: {xs: 0, sm: 0.5},
                     px: 3,
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
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
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
                <Box display="flex" alignItems="center" flexDirection="column" mt={0.5}>
                    <Divider sx={{width: "60%"}}>
                        <Box display="flex" flexDirection="row" gap={0.5}>
                            <PersonOutlinedIcon fontSize="small" color="disabled"/>
                            <Typography variant="subtitle2" fontWeight="lighter"
                                        sx={{mr: 2}}>
                                {creator}
                            </Typography>
                            <CommentOutlinedIcon fontSize="small" color="disabled"/>
                            <Typography variant="subtitle2" fontWeight="lighter">
                                {comments}
                            </Typography>
                        </Box>
                    </Divider>
                </Box>
            </Box>
        </Link>
    );
}
