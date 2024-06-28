import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Box, Skeleton, Typography} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import BackButton from "../components/BackButton";

const Recipe = () => {
    const {id} = useParams();
    const [topicData, setTopicData] = useState();
    const [isPending, setIsPending] = useState(true);

    useEffect(() => {
        fetch(`/api/recipes/${id}`, {
            // headers: {
            //   Authorization: token && `Bearer ${token}`,
            // },
        })
            .then((response) => response.json())
            .then((data) => {
                setTopicData(data);
                setIsPending(false);
            });
    }, []);

    return (
        <>
            <BackButton/>
            <Box
                display="flex"
                justifyContent="space-between"
                gap="4em"
                width="100%"
                my="2em"
            >
                <Box width="100%">
                    {topicData && topicData.readOnly && (
                        <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
                            <LockOutlinedIcon color="disabled"/>
                            <Typography variant="h6" fontWeight="light">
                                read-only
                            </Typography>
                        </Box>
                    )}
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-between"
                    >
                        <Typography
                            component="h2"
                            variant="h2"
                            fontWeight="regular"
                            gutterBottom
                        >
                            {isPending ? <Skeleton width={300}/> : topicData.name}
                        </Typography>
                    </Box>
                    <Typography variant="h5" fontWeight="regular">
                        {isPending ? <Skeleton width={600}/> : topicData.comment}
                    </Typography>
                </Box>
            </Box>
        </>
    );
};

export default Recipe;
