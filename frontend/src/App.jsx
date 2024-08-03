import HeaderBar from "./components/HeaderBar";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import RecipesBrowser from "./pages/RecipesBrowser";
import UserRecipes from "./pages/UserRecipes";
import RecipeDetails from "./pages/RecipeDetails";
import CreateRecipe from "./pages/CreateRecipe";
import EditRecipe from "./pages/EditRecipe";
import Healthcheck from "./pages/Healthcheck";
import ThemeSwitcher from "./components/ThemeSwitcher";
import {Navigate, Route, Routes} from "react-router-dom";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {ColorModeContext, useMode} from "./theme";
import useAuthData from "./hooks/useAuthData";

export default function App() {
    const [theme, colorMode] = useMode();
    const {token} = useAuthData();

    const isAuthenticated = token !== undefined;

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <HeaderBar/>
                <ThemeSwitcher/>
                <main className="content">
                    <Routes>
                        <Route path="/" element={<RecipesBrowser/>}/>
                        <Route path="/login"
                               element={isAuthenticated ? <Navigate to="/user-recipes" replace/> : <Login/>}/>
                        <Route path="/signup"
                               element={isAuthenticated ? <Navigate to="/user-recipes" replace/> : <SignUp/>}/>
                        <Route path="/recipes" element={<RecipesBrowser/>}/>
                        <Route path="/user-recipes"
                               element={isAuthenticated ? <UserRecipes/> : <Navigate to="/login" replace/>}/>
                        <Route path="/recipes/:id" element={<RecipeDetails/>}/>
                        <Route path="/create-recipe"
                               element={isAuthenticated ? <CreateRecipe/> : <Navigate to="/login" replace/>}/>
                        <Route path="/edit-recipe/:id"
                               element={isAuthenticated ? <EditRecipe/> : <Navigate to="/login" replace/>}/>
                        <Route path="/healthcheck" element={<Healthcheck/>}/>
                    </Routes>
                </main>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}