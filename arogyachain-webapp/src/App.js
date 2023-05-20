/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import './App.css';
import Enroll from './Pages/Common/Enroll';
import Pages from './Pages';
import Login from './Pages/Common/Login';
import AadhaarVerificationGetOTP from './Pages/Common/AdhaarVerificationGetOTP';

import { useAxios } from './utils/axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useStoreState, useStoreActions } from 'easy-peasy';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import { useState, useEffect } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#865DFF',
    },
  },
  shape: {
    borderRadius: 7,
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  },
});

function App() {
  const axios = useAxios();

  const identity = useStoreState(store => store?.identityDetails?.identity);
  const setIdentity = useStoreActions(
    actions => actions?.identityDetails?.setIdentity,
  );
  // eslint-disable-next-line no-console
  console.log('iden', identity);
  const [loadingIdentity, setLoadingIdentity] = useState(false);

  // get the identity details
  useEffect(() => {
    setLoadingIdentity(true);
    axios
      .get('/common/getIdentityDetails', { withCredentials: true })
      .then(res => {
        setIdentity(res?.data?.data?.user);
      })
      .catch(err => {
        console.log('Not logged in!');
      })
      .finally(() => {
        setLoadingIdentity(false);
      });
  }, [axios, setIdentity]);
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        {loadingIdentity ? (
          'Loading...'
        ) : (
          <Router>
            <Switch>
              <Route path="/initiateAadharVerification" exact>
                <AadhaarVerificationGetOTP />
              </Route>
              <Route path="/enroll" exact>
                {Object.keys(identity).length !== 0 ? (
                  <Redirect to="/" />
                ) : (
                  <Enroll />
                )}
              </Route>

              <Route path="/login" exact>
                {Object.keys(identity).length !== 0 ? (
                  <Redirect to="/" />
                ) : (
                  <Login />
                )}
              </Route>
              <Route
                path="/"
                render={({ location }) =>
                  Object.keys(identity).length !== 0 ? (
                    <Pages />
                  ) : (
                    <Redirect to="/login" />
                  )
                }
              />
            </Switch>
          </Router>
        )}
      </ThemeProvider>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
