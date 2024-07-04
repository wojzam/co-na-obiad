import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Box, Divider, Skeleton, Typography} from "@mui/material";
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
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                    >
                        <Typography variant="h6" fontWeight="regular">
                            {isPending ? <Skeleton width={100}/> : topicData?.category.name}
                        </Typography>
                        <Typography component="h2" variant="h2" fontWeight="regular" gutterBottom>
                            {isPending ? <Skeleton width={300}/> : topicData?.name}
                        </Typography>
                        <Divider/>
                        <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
                            <Box>
                                <Typography variant="h5" marginTop={3} fontWeight="medium" gutterBottom>
                                    Składniki:
                                </Typography>
                                {isPending ? (
                                    <Skeleton width={600}/>
                                ) : (
                                    topicData?.ingredientSections.map((section) => (
                                        <div key={section._id}>
                                            <Typography variant="h6"
                                                        fontWeight="regular">{section.section_name}</Typography>
                                            <ul>
                                                {section.ingredients.map((ingredient) => (
                                                    <li key={ingredient._id}>{ingredient.name}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))
                                )}
                            </Box>
                            <Box width="80%">
                                {topicData?.comment && (
                                    <>
                                        <Typography marginTop={3} variant="h5" fontWeight="medium"
                                                    gutterBottom>Komentarz:</Typography>
                                        <Typography variant="h6" fontWeight="regular">{topicData.comment}</Typography>
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default Recipe;
