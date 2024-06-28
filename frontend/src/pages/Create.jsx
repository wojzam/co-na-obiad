import { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { TopicForm } from "../components/TopicForm";

export default function CreateTopic() {
  const [collaborators, setCollaborators] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("None");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const token = localStorage.getItem("token");

    fetch("/api/topic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: data.get("title"),
        description: data.get("description"),
        publicVisibility: data.get("publicVisibility") === "public",
        category: selectedCategory,
        collaborators: collaborators.map((user) => user.id),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(JSON.parse(text).title);
          });
        }
        return response.json();
      })
      .then((data) => {
        window.history.pushState({ url: "/userTopics" }, "", "/userTopics");
        window.location.href = `/topic/${data.id}`;
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Create topic
        </Typography>
        {errorMessage && (
          <Typography component="h5" variant="h5" color="error" gutterBottom>
            {errorMessage}
          </Typography>
        )}
        <TopicForm
          handleSubmit={handleSubmit}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          collaborators={collaborators}
          setCollaborators={setCollaborators}
        />
      </Box>
    </Container>
  );
}
