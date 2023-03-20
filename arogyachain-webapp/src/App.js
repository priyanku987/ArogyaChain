import logo from "./logo.svg";
import "./App.css";
import { Button } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Cookies from "js-cookie";

const theme = createTheme({
  palette: {
    primary: {
      main: "#865DFF",
    },
  },
});

function App() {
  function isCertificateAndPrivateKeyAvailable() {
    const certificate = Cookies?.get("ACCertificate");
    const privateKey = Cookies?.get("ACPrivateKey");
    if (certificate && privateKey) {
      return true;
    } else {
      return false;
    }
  }
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            {/* <Route path="/" render={() => <Dashboard />} /> */}
            <Route path="/login" exact>
              {isCertificateAndPrivateKeyAvailable() ? (
                <Redirect to="/" />
              ) : (
                <Login />
              )}
            </Route>
            <Route
              path="/"
              render={({ location }) =>
                isCertificateAndPrivateKeyAvailable() ? (
                  <Dashboard />
                ) : (
                  <Redirect
                    to={`/login?next=${encodeURIComponent(
                      `${location.pathname}${location.search}`
                    )}`}
                  />
                )
              }
            />
          </Switch>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
