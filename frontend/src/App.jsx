import HeaderBar from "./components/HeaderBar";
import Login from "./pages/Login";
import RecipesBrowser from "./pages/RecipesBrowser.jsx";
import Recipe from "./pages/Recipe.jsx";
import Create from "./pages/Create";
import ThemeSwitcher from "./components/ThemeSwitcher";
import Healthcheck from "./components/Healthcheck";
import {Route, Routes} from "react-router-dom";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {ColorModeContext, useMode} from "./theme";

export default function App() {
    const [theme, colorMode] = useMode();
    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <HeaderBar/>
                <ThemeSwitcher/>
                <main className="content">
                    <Routes>
                        <Route path="/" element={<Login/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/signup" element={<Login/>}/>
                        <Route path="/recipes" element={<RecipesBrowser/>}/>
                        <Route path="/userRecipes" element={<RecipesBrowser/>}/>
                        <Route path="/recipes/:id" element={<Recipe/>}/>
                        <Route path="/create" element={<Create/>}/>
                        <Route path="/healthcheck" element={<Healthcheck/>}/>
                    </Routes>
                </main>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}
