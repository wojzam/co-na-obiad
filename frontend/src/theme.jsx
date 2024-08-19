import {createContext, useEffect, useMemo, useState} from "react";
import createTheme from "@mui/material/styles/createTheme";
import {grey, teal} from "@mui/material/colors";

export const themeSettings = (mode) => {
    return {
        palette: {
            mode: mode,
            ...(mode === "light"
                ? {
                    // light mode
                    primary: {
                        main: "#3D314A",
                    },
                    secondary: {
                        main: "#ffba73",
                    },
                    neutral: {
                        main: "#ebebeb",
                        darker: "#dedede",
                    },
                    background: {
                        default: "#fcfcfc",
                    },
                    lightGrey: {
                        main: "lightgray"
                    }
                }
                : {
                    // dark mode
                    primary: {
                        main: "#ffba73",
                    },
                    secondary: {
                        main: teal[500],
                    },
                    neutral: {
                        main: "#392d26",
                        darker: "#232020",
                    },
                    background: {
                        default: "#473931",
                    },
                    lightGrey: {
                        main: "#605c5a"
                    }
                }),
            light: {
                main: grey.A100,
            },
        },
        typography: {
            fontFamily: ["Quicksand", "sans-serif"].join(","),
        },
    };
};

export const ColorModeContext = createContext({
    toggleColorMode: () => {
    },
});

export const useMode = () => {
    const [mode, setMode] = useState(localStorage.getItem("mode") || "light");

    useEffect(() => {
        localStorage.setItem("mode", mode);
    }, [mode]);

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () =>
                setMode((prev) => (prev === "dark" ? "light" : "dark")),
        }),
        []
    );

    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
    return [theme, colorMode];
};
