import { useState, useEffect } from "react";
import {
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  List,
  ListItem,
} from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { UserListItem } from "./UserListItem";

export default function CollaboratorsDialog({
  updateMode,
  topicId,
  disabled,
  collaborators,
  setCollaborators,
}) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    setSearchQuery("");
    setSearchResult([]);
  }, [open]);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    handleSearch(event.target.value);
  };

  const handleSearch = (query) => {
    if (query.trim().length > 1) {
      fetch(`/api/public/user?username=${query}`)
        .then((response) => response.json())
        .then((data) => {
          const filteredData = data.filter(
            (user) =>
              user.username !== localStorage.getItem("user") &&
              !collaborators.some((c) => c.id === user.id)
          );
          setSearchResult(filteredData);
        });
    } else {
      setSearchResult([]);
    }
  };

  const handleAdd = (user) => {
    updateMode && handleCollaboratorUpdate("POST", user.id);

    setCollaborators((prev) => [user, ...prev]);
    setSearchResult([]);
    setSearchQuery("");
  };

  const handleRemove = (id) => {
    updateMode && handleCollaboratorUpdate("DELETE", id);

    setCollaborators((prev) => prev.filter((user) => user.id !== id));
  };

  const handleCollaboratorUpdate = (method, userId) => {
    const token = localStorage.getItem("token");
    fetch(`/api/topic/${topicId}/collaborator?userId=${userId}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return (
    <>
      <Button
        fullWidth
        variant="outlined"
        size="large"
        onClick={() => setOpen(true)}
        disabled={disabled}
      >
        {"Collaborators: " + collaborators.length}
      </Button>
      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogTitle align="center" mx={10}>
          Add Collaborators
        </DialogTitle>
        <TextField
          sx={{ mx: 2, my: 1 }}
          label="Find users"
          placeholder="username..."
          value={searchQuery}
          onChange={handleInputChange}
        />
        <List>
          {searchResult.map((user) => (
            <ListItem
              key={user.id}
              secondaryAction={
                <IconButton onClick={() => handleAdd(user)}>
                  <ControlPointIcon sx={{ color: "green" }} />
                </IconButton>
              }
            >
              <UserListItem username={user.username} />
            </ListItem>
          ))}
        </List>
        <List>
          <ListItem>Collaborators:</ListItem>
          {collaborators.map((user) => (
            <ListItem
              key={user.id}
              secondaryAction={
                <IconButton onClick={() => handleRemove(user.id)}>
                  <RemoveCircleOutlineIcon sx={{ color: "red" }} />
                </IconButton>
              }
            >
              <UserListItem username={user.username} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </>
  );
}
