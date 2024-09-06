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
            text: ""
        }
    });
    const [comments, setComments] = useState([]);
    const [canComment, setCanComment] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);
    const [activeReplayInput, setActiveReplayInput] = useState(null);
    const commentFieldRef = useRef(null);

    const displayedComments = showAllComments ? comments : comments.slice(0, 3);

    useEffect(() => {
        setCanComment(initialCanComment);
        setComments(Array.isArray(initialComments) ? initialComments : []);
        setShowAllComments(initialComments !== undefined && initialComments.length <= 3);
    }, [initialCanComment, initialComments]);

    useEffect(() => {
        reset();
    }, [activeReplayInput]);

    const openTextField = () => {
        setShowAllComments(true);
        setActiveReplayInput(null)
        if (commentFieldRef.current) {
            focusOnTextField();
        }
    }

    const focusOnTextField = () => {
        commentFieldRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
        commentFieldRef.current.focus();
    }

    const onSubmit = (data) => {
        axiosInstance.post(`/api/recipes/${recipeId}/comments`, {
            text: data.text,
            parentId: activeReplayInput
        }, {
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then((response) => {
                setComments(response.data.comments);
                setCanComment(response.data.canComment);
                reset();
                setActiveReplayInput(null);
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

    const CommentView = ({comment, depth = 0, sx = {}}) => {
        return (
            <Box sx={sx}>
                <Paper elevation={3} sx={{py: 1.5, px: 2, mb: 2, borderRadius: 4}}>
                    <Box display="flex" flexDirection="row" justifyContent="space-between">
                        <Typography variant="h6" fontWeight="medium">
                            {comment?.creator}
                        </Typography>
                        <IconButton sx={{display: comment.canDelete ? "block" : "none"}}
                                    onClick={() => handleDelete(comment._id)}>
                            <DeleteOutlinedIcon fontSize="small"/>
                        </IconButton>
                    </Box>
                    <Typography variant="caption" color="textSecondary">
                        {comment?.createdAt}
                    </Typography>
                    <Typography variant="body1" fontWeight="medium" sx={{
                        mt: 2,
                        mb: depth >= 2 ? 1 : 0,
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                    }}>
                        {comment?.text}
                    </Typography>
                    <Box width="100%" display="flex" justifyContent="end">
                        <Button disabled={!canComment} sx={{display: depth >= 2 ? "none" : "flex"}}
                                onClick={() => setActiveReplayInput(comment._id)}
                                startIcon={<ReplyIcon/>}>
                            Odpowiedz
                        </Button>
                    </Box>
                </Paper>
                <CommentInput display={activeReplayInput === comment._id ? "flex" : "none"}
                              sx={{ml: 4, mt: 0, mb: 4}}/>
            </Box>
        )
    };

    const CommentInput = ({display = "flex", sx = {}}) => {
        return (
            <Box display={display} alignItems="flex-end" component="form" sx={sx}
                 onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="text"
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
                            value: /^[\p{L}0-9 @\-!.,_:(){}*#%?]+$/u,
                            message: 'Komentarz może zawierać tylko litery, cyfry i znaki @-!.,_:(){}*#%?'
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
                            fullWidth
                            error={!!errors.text}
                            helperText={errors.text ? errors.text.message : ''}
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
        )
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
                            <Box key={comment._id}>
                                <CommentView comment={comment}/>
                                {comment.children.map((child1) => (
                                    <Box key={child1._id}>
                                        <CommentView comment={child1} depth={1} sx={{ml: 4}}/>
                                        {child1.children.map((child2) => (
                                            <Box key={child2._id}>
                                                <CommentView comment={child2} depth={2} sx={{ml: 8}}/>
                                            </Box>
                                        ))}
                                    </Box>
                                ))}
                            </Box>
                        ))}
                        {comments.length > 3 && (
                            <Box display="flex" justifyContent="center">
                                <Button onClick={() => setShowAllComments(true)}
                                        sx={{
                                            mt: 2,
                                            fontSize: "large",
                                            display: showAllComments ? "none" : "block"
                                        }}>
                                    {!showAllComments && `Załaduj więcej (${comments.length - 3})...`}
                                </Button>
                            </Box>
                        )}
                    </>
                ) : (
                    <Typography variant="body1" color="textSecondary">
                        Brak komentarzy. Bądź pierwszą/ym, który skomentuje!
                    </Typography>
                )}
            </Box>
            <CommentInput display={showAllComments && activeReplayInput === null ? "flex" : "none"}
                          sx={{mt: 3, mb: 4}}/>
        </Box>
    );
}

export default CommentsSection;