import { useState, useEffect } from "react";
import { AppBar, Button, Box, Menu, MenuItem } from "@mui/material";

const homeButtonStyle = {
  textTransform: "none",
  fontSize: 20,
  color: "white",
  whiteSpace: "nowrap",
};

const buttonStyle = {
  fontSize: 16,
  color: "white",
  whiteSpace: "nowrap",
};

const loginButtonStyle = {
  width: 100,
  borderRadius: 3,
  fontSize: 16,
};

const signupButtonStyle = {
  width: 100,
  borderRadius: 3,
  fontSize: 16,
  color: "black",
};

export default function HeaderBar() {
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin"));
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
    localStorage.removeItem("isAdmin");
    setUser(null);
    setIsAdmin(false);
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
          setIsAdmin(data.admin);
          localStorage.setItem("user", data.username);
          localStorage.setItem("id", data.id);
          localStorage.setItem("isAdmin", data.admin);
        })
        .catch(() => {
          handleLogout();
        });
    }
  }, []);

  return (
    <AppBar position="fixed" sx={{ background: "#FF7020" }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 1 }}
      >
        <Button href="/" sx={homeButtonStyle}>
          Brain Stormer
        </Button>
        <Box display="flex" sx={{ gap: 2 }}>
          <Button href="/explore" sx={buttonStyle}>
            Explore
          </Button>
          <Button href="/userTopics" disabled={!user} sx={buttonStyle}>
            My topics
          </Button>
          <Button href="/create" disabled={!user} sx={buttonStyle}>
            Create
          </Button>
          {isAdmin && (
            <Button href="/admin" sx={buttonStyle}>
              Admin Dashboard
            </Button>
          )}
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
          <Box display="flex" sx={{ gap: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              href="/login"
              sx={loginButtonStyle}
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="light"
              href="/signup"
              sx={signupButtonStyle}
            >
              Sign up
            </Button>
          </Box>
        )}
      </Box>
    </AppBar>
  );
}
