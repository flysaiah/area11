import { Fragment, useContext, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from './Components/Home/Home';
import Login from "./Components/Login/Login";
import Timeline from "./Components/Timeline/Timeline";
import AuthContext from "./Store/AuthContext";
import { CssBaseline, Snackbar, SnackbarContent, ThemeProvider } from "@mui/material";
import { AppTheme } from "./Themes/theme";

const App = () => {

    const authContext = useContext(AuthContext);

    const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>("");
    const [isSnackbarError, setIsSnackbarError] = useState<boolean>(false);

    let timeoutId:NodeJS.Timeout;

    const showToast = (message:string, isError:boolean) => {
        clearTimeout(timeoutId);

        setShowSnackbar(false);
        setSnackbarMessage(message);
        setIsSnackbarError(isError);
        setShowSnackbar(true);

        timeoutId = setTimeout(() => setShowSnackbar(false), 3000);
    }

    return (
        <Fragment>
            <header>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&display=swap" rel="stylesheet" />
            </header>
            <ThemeProvider theme={AppTheme}>
                <CssBaseline enableColorScheme/>
                <Snackbar anchorOrigin={{vertical: "top", horizontal: "center"}} open={showSnackbar} key={"topcenter"}>
                    <SnackbarContent
                        sx={{textAlign: "center",
                            display: "block",
                            backgroundColor: isSnackbarError ? AppTheme.palette.warning.main : AppTheme.palette.secondary.main,
                            padding: "0px"}}
                        message={snackbarMessage}/>
                </Snackbar>
                <Routes>
                    <Route path="/" element={authContext.isLoggedIn ? <Navigate replace to="/home" /> : <Navigate replace to="/login" />} />
                    <Route path="/login" element={authContext.isLoggedIn ? <Navigate replace to="/home" /> : <Login />} />
                    <Route path="/home" element={authContext.isLoggedIn ? <Home showToast={showToast} /> : <Navigate replace to="/login" />} />
                    <Route path="/timeline" element={authContext.isLoggedIn ? <Timeline showToast={showToast} /> : <Navigate replace to="/login" />} />
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
