import {useEffect, useState} from "react";
import {AppBar, Box, Button, Menu, MenuItem} from "@mui/material";

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
    const [user, setUser] = useState(localStorage.getItem("user"));
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("id");
        setUser(null);
        handleClose();
        window.location.href = "/login";
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetch("/api/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error();
                    }
                    return response.json();
                })
                .then((data) => {
                    setUser(data.username);
                    localStorage.setItem("user", data.username);
                    localStorage.setItem("id", data.id);
                })
                .catch(() => {
                    handleLogout();
                });
        }
    }, []);

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
                <Box display="flex" sx={{gap: 2}}>
                    <Button href="/recipes" sx={buttonStyle}>
                        Przepisy
                    </Button>
                    <Button href="/userRecipes" sx={buttonStyle}>
                        Moje przepisy
                    </Button>
                    <Button href="/create" /*disabled={!user}*/ sx={buttonStyle}>
                        Dodaj przepis
                    </Button>
                </Box>
                {user ? (
                    <Box mr={2}>
                        <Button onClick={handleClick} sx={buttonStyle}>
                            {user}
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>My account</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
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
        </AppBar>
    );
}
