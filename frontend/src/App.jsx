import HeaderBar from "./components/HeaderBar";
import Login from "./pages/Login";
import TopicsList from "./pages/TopicsList";
import Create from "./pages/Create";
import ThemeSwitcher from "./components/ThemeSwitcher";
import { Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

export default function App() {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HeaderBar />
        <ThemeSwitcher />
        <main className="content">
          <Routes>
            {/*<Route path="/" element={<Home />} />*/}
            {/*<Route path="/signup" element={<SignUp />} />*/}
            <Route path="/" element={<Login />} />
            <Route
              path="/explore"
              element={<TopicsList isUserTopics={false} />}
            />
            <Route
              path="/userTopics"
              element={<TopicsList isUserTopics={true} />}
            />
            <Route path="/create" element={<Create />} />
            {/*<Route path="/topic/:id" element={<Topic />} />*/}
            {/*<Route path="/admin" element={<AdminDashboard />} />*/}
          </Routes>
        </main>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
