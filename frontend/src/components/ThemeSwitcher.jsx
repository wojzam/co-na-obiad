import { useContext } from "react";
import { ColorModeContext } from "../theme";
import { IconButton, useTheme } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

export default function ThemeSwitcher() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <IconButton
      onClick={colorMode.toggleColorMode}
      sx={{
        position: "absolute",
        top: 70,
        right: 10,
      }}
    >
      {theme.palette.mode === "dark" ? (
        <DarkModeOutlinedIcon />
      ) : (
        <LightModeOutlinedIcon />
      )}
    </IconButton>
  );
}
