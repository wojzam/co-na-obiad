import { useEffect, useState } from "react";
import { Typography, CircularProgress } from "@mui/material";
import Topic from "../components/Topic";
import TopicsListControls from "../components/TopicsListControls";

const TopicsList = ({ isUserTopics }) => {
  const [topics, setTopics] = useState();
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    const endpoint = isUserTopics ? "/api/recipes" : "/api/recipes";
    const token = localStorage.getItem("token");

    fetch(endpoint, {
      headers: {
        Authorization: isUserTopics && `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
          console.log(data);
        // setTopics(data);
        // setIsPending(false);
      });
  }, []);

  return (
    <>
      <Typography component="h1" variant="h2" fontWeight="medium" gutterBottom>
        {isUserTopics ? "My topics" : "Explore"}
      </Typography>
      <TopicsListControls {...{ isUserTopics, setTopics }} />
      {isPending && <CircularProgress />}
      {topics && topics.map((topic) => <Topic key={topic.id} {...topic} />)}
    </>
  );
};

export default TopicsList;
