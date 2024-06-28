import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ValidatedTextField from "./ValidatedTextField";

export default function TopicEditDialog({
  id,
  title: initialTitle = "",
  description: initialDescription = "",
  category: initialCategory = "",
  publicVisibility: initialPublicVisibility = false,
  setTopicData,
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [publicVisibility, setPublicVisibility] = useState(
    initialPublicVisibility
  );

  useEffect(() => {
    fetch("/api/public/category")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      });
  }, []);

  const handleUpdate = () => {
    if (title.trim() !== "") {
      const token = localStorage.getItem("token");

      fetch(
        `/api/topic/${id}?title=${title}&description=${description}&category=${selectedCategory}&publicVisibility=${publicVisibility}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ).then(() => {
        setTopicData((prevData) => ({
          ...prevData,
          title: title,
          description: description,
          category: selectedCategory,
          publicVisibility: publicVisibility,
        }));
        setOpen(false);
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTitle(initialTitle);
    setDescription(initialDescription);
    setSelectedCategory(initialCategory);
    setPublicVisibility(initialPublicVisibility);
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <EditOutlinedIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle align="center" mx={20}>
          Edit Topic
        </DialogTitle>
        <DialogContent>
          <ValidatedTextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={50}
            sx={{ marginY: 1 }}
          />
          <ValidatedTextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            minLength={0}
            maxLength={1000}
            multiline
            rows={5}
            sx={{ marginY: 2 }}
          />
          <Autocomplete
            disablePortal
            id="category"
            value={selectedCategory}
            options={categories}
            onChange={(e, v) => setSelectedCategory(v)}
            disableClearable
            renderInput={(params) => <TextField {...params} label="Category" />}
            sx={{ marginY: 2 }}
          />
          <RadioGroup
            aria-labelledby="radio-buttons-group-label"
            value={publicVisibility ? "true" : "false"}
            onChange={(e) => setPublicVisibility(e.target.value === "true")}
            name="publicVisibility"
            row
          >
            <FormControlLabel
              value="false"
              control={<Radio />}
              label="Private"
            />
            <FormControlLabel value="true" control={<Radio />} label="Public" />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
