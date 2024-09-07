import React, {useEffect, useState} from 'react';
import {Box, Button, Drawer, IconButton, useTheme} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import useAuthData from '../hooks/useAuthData';
import AddIcon from '@mui/icons-material/Add';

export default function MobileMenu({openRecipes, openUserRecipes}) {
    const {logout, username} = useAuthData();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [menuHeight, setMenuHeight] = useState('100vh');
    const theme = useTheme();

    const buttonStyle = {
        fontSize: 18, color: theme.palette.primary.main, whiteSpace: "nowrap",
    };

    const loginButtonStyle = {
        width: "100%", borderRadius: 3, fontSize: 18, color: theme.palette.primary.main,
    };

    const signupButtonStyle = {
        width: "100%",
        borderRadius: 3,
        fontSize: 18,
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.neutral.darker,
    };

    useEffect(() => {
        const handleResize = () => {
            const height = window.innerHeight;
            setMenuHeight(`${height}px`);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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

    return (<>
        <Box display={{xs: 'flex', md: 'none'}}>
            <IconButton
                edge="start"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{color: "black"}}
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
                sx={{width: 250, height: menuHeight, backgroundColor: theme.palette.background.default}}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    height="100%"
                    p={2}
                >
                    <Box display="flex" flexDirection="column" gap={2} p={2}>
                        <Button href="/menu" sx={buttonStyle}>
                            Menu
                        </Button>
                        <Button onClick={openRecipes} sx={buttonStyle}>
                            Wszystkie Przepisy
                        </Button>
                        <Button onClick={openUserRecipes} disabled={!username} sx={buttonStyle}>
                            Moje przepisy
                        </Button>
                        <Button href="/create-recipe" disabled={!username} sx={buttonStyle} startIcon={<AddIcon/>}>
                            Dodaj
                        </Button>
                    </Box>
                    <Box display="flex" flexDirection="column" gap={2} p={2}>
                        {username ? (<>
                            <Button
                                startIcon={<AccountCircleOutlinedIcon/>}
                                disabled={true}>
                                {username}
                            </Button>
                            <Button
                                onClick={() => window.location.href = '/user-profile'}
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
                        </>) : (<>
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
                        </>)}
                    </Box>
                </Box>
            </Box>
        </Drawer>
    </>);
}
