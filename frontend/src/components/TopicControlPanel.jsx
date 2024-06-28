import { useState } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CollaboratorsDialog from "../components/CollaboratorsDialog";
import TopicEditDialog from "../components/TopicEditDialog";
import ConfirmationDialog from "../components/ConfirmationDialog";
import useGenerateStatus from "../hooks/useGenerateStatus";

export default function TopicControlPanel({
  topicData,
  setTopicData,
  collaborators,
  setCollaborators,
}) {
  const [generateReady, setGenerateReady] = useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

  useGenerateStatus({ topicId: topicData.id, setReady: setGenerateReady });

  const handleGenerateClick = () => {
    const token = localStorage.getItem("token");
    fetch(`/api/topic/${topicData.id}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const handleDelete = () => {
    const token = localStorage.getItem("token");
    fetch(`/api/topic/${topicData.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      window.location.href = `/userTopics`;
    });
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="regular" noWrap>
        {topicData && (
          <CollaboratorsDialog
            updateMode={true}
            topicId={topicData.id}
            disabled={!topicData.canEdit}
            {...{ collaborators, setCollaborators }}
          />
        )}
      </Typography>
      {topicData && topicData.canEdit && (
        <Box display="flex" justifyContent="space-between" my={1}>
          <Button
            onClick={handleGenerateClick}
            variant="outlined"
            disabled={!generateReady}
          >
            {generateReady ? "Generate" : "Pending"}
          </Button>
          <TopicEditDialog
            {...{
              id: topicData.id,
              title: topicData.title,
              description: topicData.description,
              category: topicData.category,
              publicVisibility: topicData.publicVisibility,
              setTopicData,
            }}
          />
          <IconButton onClick={() => setOpenConfirmationDialog(true)}>
            <DeleteOutlinedIcon />
          </IconButton>
          <ConfirmationDialog
            open={openConfirmationDialog}
            setOpen={setOpenConfirmationDialog}
            onConfirm={handleDelete}
          />
        </Box>
      )}
    </Box>
  );
}
