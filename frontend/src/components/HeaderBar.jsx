import React, {useState} from "react";
import {AppBar, Box, Button, Menu, MenuItem} from "@mui/material";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import useAuthData from "../hooks/useAuthData";
import {defaultFilter, defaultSort, useSearchState} from "../hooks/useSearchState";
import MobileMenu from './MobileMenu';
import AddIcon from '@mui/icons-material/Add';
import {useNavigate} from "react-router-dom";

const homeButtonStyle = {
    textTransform: "none",
    fontSize: 20,
    color: "black",
    whiteSpace: "nowrap",
};

const buttonStyle = {
    fontSize: 16,
    color: "black",
    whiteSpace: "nowrap",
};

const loginButtonStyle = {
    width: 150,
    borderRadius: 3,
    fontSize: 16,
    color: "black",
};

const signupButtonStyle = {
    width: 150,
    borderRadius: 3,
    fontSize: 16,
    color: "black",
};

export default function HeaderBar() {
    const {logout, username} = useAuthData();
    const [anchorEl, setAnchorEl] = useState(null);
    const {save: saveRecipesSearch} = useSearchState({id: "/recipes"});
    const {save: saveUserRecipesSearch} = useSearchState({id: "/user-recipes"});
    const navigate = useNavigate();

    const openRecipes = () => {
        saveRecipesSearch({filter: defaultFilter, sort: defaultSort});
        navigate("/recipes");
        navigate(0);
    }

    const openUserRecipes = () => {
        saveUserRecipesSearch({filter: defaultFilter, sort: defaultSort});
        navigate("/user-recipes");
        navigate(0);
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        logout();
    };

    return (
        <AppBar position="fixed" sx={{background: "#ffba73"}}>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{p: 1}}
            >
                <Button href="/" sx={homeButtonStyle}>
                    Co Na Obiad
                </Button>

                {/* Desktop view */}
                <Box display={{xs: 'none', md: 'flex'}} sx={{gap: 4}}>
                    <Button onClick={openRecipes} sx={buttonStyle}>
                        Wszystkie przepisy
                    </Button>
                    <Button onClick={openUserRecipes} disabled={!username} sx={buttonStyle}>
                        Moje przepisy
                    </Button>
                    <Button href="/create-recipe" disabled={!username} sx={buttonStyle} startIcon={<AddIcon/>}>
                        Dodaj
                    </Button>
                </Box>
                <Box display={{xs: 'none', md: 'flex'}}>
                    {username ? (
                        <Box mr={2}>
                            <Button startIcon={<AccountCircleOutlinedIcon/>} onClick={handleClick} sx={buttonStyle}>
                                {username}
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => window.location.href = '/user-profile'}>Moje konto</MenuItem>
                                <MenuItem onClick={handleLogout}>Wyloguj</MenuItem>
                            </Menu>
                        </Box>
                    ) : (
                        <Box display="flex" sx={{gap: 2}}>
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
                        </Box>
                    )}
                </Box>

                {/* Mobile Menu */}
                <MobileMenu openRecipes={openRecipes} openUserRecipes={openUserRecipes}/>
            </Box>
        </AppBar>
    );
}
