import { Fragment, useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from './Components/Home/Home';
import Login from "./Components/Login/Login";
import Timeline from "./Components/Timeline/Timeline";
import AuthContext from "./Store/AuthContext";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AppTheme } from "./Themes/theme";

const App = () => {

    const authContext = useContext(AuthContext);

    return (
        <Fragment>
            <header>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&display=swap" rel="stylesheet" />
            </header>
            <ThemeProvider theme={AppTheme}>
                <CssBaseline enableColorScheme/>
                <Routes>
                    <Route path="/" element={authContext.isLoggedIn ? <Navigate replace to="/home" /> : <Navigate replace to="/login" />} />
                    <Route path="/login" element={authContext.isLoggedIn ? <Navigate replace to="/home" /> : <Login />} />
                    <Route path="/home" element={authContext.isLoggedIn ? <Home /> : <Navigate replace to="/login" />} />
                    <Route path="/timeline" element={authContext.isLoggedIn ? <Timeline /> : <Navigate replace to="/login" />} />
                    <Route
                        path="*"
                        element={
                            <div>
                                <p>404 Page not Found</p>
                            </div>
                        }
                    />
                </Routes>
            </ThemeProvider>
        </Fragment>
    );
}

export default App;
