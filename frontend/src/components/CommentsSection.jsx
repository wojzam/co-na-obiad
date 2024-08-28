import React, {useEffect, useRef, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import useAuthAxios from "../hooks/useAuthAxios.jsx";
import {Box, Button, Divider, IconButton, Paper, TextField, Typography, useTheme} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddCommentIcon from '@mui/icons-material/AddComment';

const CommentsSection = ({recipeId, initialCanComment, initialComments = []}) => {
    const theme = useTheme();
    const axiosInstance = useAuthAxios();
    const {handleSubmit, control, formState: {errors}, reset} = useForm({
        mode: "all",
        defaultValues: {
            comment: "",
        }
    });
    const [comments, setComments] = useState([]);
    const [canComment, setCanComment] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);
    const commentFieldRef = useRef(null);

    const displayedComments = showAllComments ? comments : comments.slice(0, 3);

    useEffect(() => {
        setCanComment(initialCanComment);
        setComments(Array.isArray(initialComments) ? initialComments : []);
        setShowAllComments(initialComments !== undefined && initialComments.length <= 3);
    }, [initialCanComment, initialComments]);

    const openTextField = () => {
        setShowAllComments(true);
        if (commentFieldRef.current) {
            focusOnTextField();
        }
    }

    const focusOnTextField = () => {
        commentFieldRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
        commentFieldRef.current.focus();
    }

    const onSubmit = (data) => {
        axiosInstance.post(`/api/recipes/${recipeId}/comments`, {text: data.comment}, {
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then((response) => {
                setComments(response.data.comments);
                setCanComment(response.data.canComment);
                reset();
                commentFieldRef.current.focus(false);
            })
            .catch(() => {
            });
    };

    const handleDelete = (commentId) => {
        axiosInstance.delete(`/api/recipes/${recipeId}/comments/${commentId}`)
            .then((response) => {
                setComments(response.data.comments);
                setCanComment(response.data.canComment);
            })
            .catch(() => {
            });
    };

    return (
        <Box mt={15}>
            <Typography fontWeight="bold" gutterBottom sx={{
                fontSize: {
                    xs: theme.typography.h6.fontSize,
                    lg: theme.typography.h5.fontSize,
                }
            }}>
                Komentarze:
            </Typography>
            <Button onClick={openTextField} startIcon={<AddCommentIcon/>} disabled={!canComment}>
                Dodaj komentarz
            </Button>
            <Divider/>
            <Box mt={2}>
                {comments && comments.length > 0 ? (
                    <>
                        {displayedComments.map((comment) => (
                            <Paper key={comment._id} elevation={3} sx={{py: 1.5, px: 2, mb: 2, borderRadius: 4}}>
                                <Box display="flex" flexDirection="row" justifyContent="space-between">
                                    <Typography variant="h6" fontWeight="medium">
                                        {comment.creator}
                                    </Typography>
                                    <IconButton sx={{display: comment.canDelete ? "block" : "none"}}
                                                onClick={() => handleDelete(comment._id)}>
                                        <DeleteOutlinedIcon fontSize="small"/>
                                    </IconButton>
                                </Box>
                                <Typography variant="caption" color="textSecondary">
                                    {comment.createdAt}
                                </Typography>
                                <Typography variant="body1" fontWeight="medium" sx={{
                                    mt: 2,
                                    wordBreak: 'break-word',
                                    overflowWrap: 'break-word',
                                }}>
                                    {comment.text}
                                </Typography>
                                <Box width="100%" display="flex" justifyContent="end">
                                    <Button disabled startIcon={<ReplyIcon/>}>Odpowiedz</Button>
                                </Box>
                            </Paper>
                        ))}
                        {comments.length > 3 && (
                            <Box display="flex" justifyContent="center">
                                <Button onClick={() => setShowAllComments(true)}
                                        sx={{mt: 2, fontSize: "large", display: showAllComments ? "none" : "block"}}>
                                    {!showAllComments && `Załaduj więcej (${comments.length - 3})...`}
                                </Button>
                            </Box>
                        )}
                    </>
                ) : (
                    <Typography variant="body1" color="textSecondary">
                        Brak komentarzy. Bądź pierwsza/ym, który skomentuje!
                    </Typography>
                )}
            </Box>
            <Box mt={3} display={showAllComments ? "flex" : "none"} alignItems="flex-end" component="form"
                 onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="comment"
                    control={control}
                    rules={{
                        required: "Komentarz nie może być pusty",
                        validate: {
                            minLengthAfterTrim: value =>
                                value.trim().length >= 1 || "Komentarz nie może być pusty"
                        },
                        maxLength: {
                            value: 1000,
                            message: "Komentarz nie może przekraczać 1000 znaków"
                        },
                        pattern: {
                            value: /^[a-zA-Z0-9 @\-!._:(){}*#%?ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/,
                            message: 'Komentarz może zawierać tylko litery, cyfry i znaki @-!._:(){}*#%?'
                        },
                    }}
                    render={({field}) => (
                        <TextField
                            {...field}
                            variant="outlined"
                            label="Dodaj komentarz"
                            multiline
                            minRows={2}
                            maxRows={8}
                            margin="normal"
                            fullWidth
                            error={!!errors.comment}
                            helperText={errors.comment ? errors.comment.message : ''}
                            inputRef={commentFieldRef}
                            disabled={!canComment}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(onSubmit)();
                                }
                            }}
                        />
                    )}
                />
                <IconButton color="primary" type="submit" disabled={!canComment}>
                    <SendIcon/>
                </IconButton>
            </Box>
        </Box>
    );
}

export default CommentsSection;