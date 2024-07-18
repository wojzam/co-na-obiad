import {useCookies} from "react-cookie";
import HeaderBar from "./components/HeaderBar";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp.jsx";
import RecipesBrowser from "./pages/RecipesBrowser.jsx";
import Recipe from "./pages/Recipe.jsx";
import Create from "./pages/Create";
import ThemeSwitcher from "./components/ThemeSwitcher";
import Healthcheck from "./components/Healthcheck";
import {Navigate, Route, Routes} from "react-router-dom";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {ColorModeContext, useMode} from "./theme";

export default function App() {
    const [theme, colorMode] = useMode();
    const [cookies] = useCookies(["token"]);

    const isAuthenticated = cookies.token !== undefined;

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <HeaderBar/>
                <ThemeSwitcher/>
                <main className="content">
                    <Routes>
                        <Route path="/" element={<RecipesBrowser/>}/>
                        <Route path="/login" element={isAuthenticated ? <Navigate to="/userRecipes" replace/> : <Login/>}/>
                        <Route path="/signup" element={isAuthenticated ? <Navigate to="/userRecipes" replace/> : <SignUp/>}/>
                        <Route path="/recipes" element={<RecipesBrowser/>}/>
                        <Route path="/userRecipes"
                               element={isAuthenticated ? <RecipesBrowser/> : <Navigate to="/login" replace/>}/>
                        <Route path="/recipes/:id" element={<Recipe/>}/>
                        <Route path="/create" element={isAuthenticated ? <Create/> : <Navigate to="/login" replace/>}/>
                        <Route path="/healthcheck" element={<Healthcheck/>}/>
                    </Routes>
                </main>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}
