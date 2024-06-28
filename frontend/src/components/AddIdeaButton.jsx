import { useState } from "react";
import { Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { IdeaForm } from "./IdeaForm";

export default function AddIdeaButton({ topicId, setIdeas }) {
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <>
      {isFormVisible ? (
        <IdeaForm mode="create" {...{ topicId, setIsFormVisible, setIdeas }} />
      ) : (
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          width="100%"
          onClick={() => setIsFormVisible(true)}
          sx={{
            my: 2,
            px: 5,
            py: 2,
            border: "dashed",
            borderColor: "#ebebeb",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          <AddIcon />
          <Typography variant="h5" fontWeight="regular">
            ADD IDEA
          </Typography>
        </Box>
      )}
    </>
  );
}
