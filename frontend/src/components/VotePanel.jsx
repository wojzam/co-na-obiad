import { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";

export const VotePanel = ({ id, votes, userVote }) => {
  const [localVotes, setLocalVotes] = useState(userVote);

  const totalVotes = () => {
    return votes - userVote + localVotes;
  };

  const isLiked = () => {
    return localVotes === 1;
  };

  const isDisliked = () => {
    return localVotes === -1;
  };

  const handleVote = (voteValue) => {
    const token = localStorage.getItem("token");
    fetch(`/api/idea/${id}/vote?value=${voteValue}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(() => setLocalVotes(voteValue));
  };

  const deleteVote = () => {
    const token = localStorage.getItem("token");
    fetch(`/api/idea/${id}/vote`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(() => setLocalVotes(0));
  };

  const handleLikeClick = () => {
    if (isLiked()) {
      deleteVote();
    } else {
      handleVote(1);
    }
  };

  const handleDislikeClick = () => {
    if (isDisliked()) {
      deleteVote();
    } else {
      handleVote(-1);
    }
  };

  const getVotesColor = () => {
    if (totalVotes() > 0) {
      return "green";
    } else if (totalVotes() < 0) {
      return "red";
    } else {
      return "gray";
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      width={100}
      mt={2}
    >
      <IconButton
        color={isDisliked() ? "secondary" : "default"}
        onClick={handleDislikeClick}
      >
        <ThumbDownOutlinedIcon />
      </IconButton>
      <Typography variant="h6" color={getVotesColor}>
        {totalVotes()}
      </Typography>
      <IconButton
        color={isLiked() ? "secondary" : "default"}
        onClick={handleLikeClick}
      >
        <ThumbUpOutlinedIcon />
      </IconButton>
    </Box>
  );
};
