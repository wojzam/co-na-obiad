import React from 'react';
import {Box, Container, Typography} from '@mui/material';
import UpdatePassword from "../components/forms/UpdatePassword";
import UpdateUsername from "../components/forms/UpdateUsername";

const UserProfile = () => {

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h4" fontWeight="medium" sx={{mb: 5}}> Moje konto </Typography>
                <UpdateUsername/>
                <UpdatePassword/>
            </Box>
        </Container>
    );
};

export default UserProfile;
