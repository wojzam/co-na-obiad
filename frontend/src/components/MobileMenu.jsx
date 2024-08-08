import React, {useState} from 'react';
import {Box, Button, Drawer, IconButton} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import useAuthData from '../hooks/useAuthData';

const buttonStyle = {
    fontSize: 18,
    color: "black",
    whiteSpace: "nowrap",
};

const loginButtonStyle = {
    width: "100%",
    borderRadius: 3,
    fontSize: 18,
    color: "black",
};

const signupButtonStyle = {
    width: "100%",
    borderRadius: 3,
    fontSize: 18,
    color: "black",
};

export default function MobileMenu() {
    const {logout, username} = useAuthData();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const handleLogout = () => {
        setDrawerOpen(false);
        logout();
    };

    return (
        <>
            <Box display={{xs: 'flex', md: 'none'}}>
                <IconButton
                    edge="start"
                    color="black"
                    aria-label="menu"
                    onClick={toggleDrawer(true)}
                >
                    <MenuIcon/>
                </IconButton>
            </Box>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                <Box
                    sx={{width: 250}}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        height="100vh"
                        p={2}
                    >
                        <Box display="flex" flexDirection="column" gap={2} p={2}>
                            <Button href="/recipes" sx={buttonStyle}>
                                Przepisy
                            </Button>
                            <Button href="/user-recipes" disabled={!username} sx={buttonStyle}>
                                Moje przepisy
                            </Button>
                            <Button href="/create-recipe" disabled={!username} sx={buttonStyle}>
                                Dodaj przepis
                            </Button>
                        </Box>
                        <Box display="flex" flexDirection="column" gap={2} p={2}>
                            {username ? (
                                <>
                                    <Button
                                        startIcon={<AccountCircleOutlinedIcon/>}
                                        disabled={true}
                                        sx={{'&.Mui-disabled': {color: 'black',},}}>
                                        {username}
                                    </Button>
                                    <Button
                                        onClick={() => window.location.href = '/my-account'}
                                        sx={buttonStyle}
                                    >
                                        Moje konto
                                    </Button>
                                    <Button
                                        onClick={handleLogout}
                                        sx={buttonStyle}
                                    >
                                        Wyloguj
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        href="/login"
                                        sx={loginButtonStyle}
                                    >
                                        Logowanie
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="light"
                                        href="/signup"
                                        sx={signupButtonStyle}
                                    >
                                        Rejestracja
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
}
