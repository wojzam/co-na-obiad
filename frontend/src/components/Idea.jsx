import { useState } from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { VotePanel } from "./VotePanel";
import { IdeaForm } from "./IdeaForm";

export default function Idea({
  id,
  title,
  description,
  votes,
  userVote,
  readOnly,
  canEdit,
  setIdeas,
}) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const theme = useTheme();

  const handleEditClick = () => {
    setIsFormVisible(true);
  };

  const handleDeleteClick = () => {
    const token = localStorage.getItem("token");
    fetch(`/api/idea/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      setIdeas((ideas) => ideas.filter((idea) => idea.id !== id));
    });
  };

  return (
    <>
      {isFormVisible ? (
        <IdeaForm
          mode="edit"
          {...{ id, title, description, setIsFormVisible, setIdeas }}
        />
      ) : (
        <Box
          display="flex"
          justifyContent="space-between"
          sx={{
            width: "100%",
            my: 2,
            px: 5,
            py: 3,
            border: "solid",
            borderColor: theme.palette.neutral.main,
            borderRadius: 8,
          }}
        >
          <Box>
            <Typography component="h2" variant="h4" fontWeight="medium">
              {title}
            </Typography>
            <Typography variant="h6">{description}</Typography>
            {!readOnly && <VotePanel {...{ id, votes, userVote }} />}
          </Box>

          {!readOnly && canEdit && (
            <Box sx={{ whiteSpace: "nowrap" }}>
              <IconButton onClick={handleEditClick}>
                <EditOutlinedIcon />
              </IconButton>
              <IconButton onClick={handleDeleteClick}>
                <DeleteOutlinedIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      )}
    </>
  );
}
