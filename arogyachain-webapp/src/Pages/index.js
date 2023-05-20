/* eslint-disable no-unused-vars */
import Healthcare from './Healthcare';
import User from './User';
import { useAxios } from '../utils/axios';
import { useEffect, useState } from 'react';
import { Link, Switch, useRouteMatch, Route, Redirect } from 'react-router-dom';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { CircularProgress } from '@mui/material';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export default function Pages() {
  const axios = useAxios();

  const identity = useStoreState(store => store?.identityDetails?.identity);
  const setIdentity = useStoreActions(
    actions => actions?.identityDetails?.setIdentity,
  );
  // eslint-disable-next-line no-console
  console.log('iden', identity);
  const [loadingIdentity, setLoadingIdentity] = useState(false);

  // // get the identity details
  // useEffect(() => {
  //   setLoadingIdentity(true);
  //   axios
  //     .get('/common/getIdentityDetails', { withCredentials: true })
  //     .then(res => {
  //       console.log('he');
  //       setIdentity(res?.data?.data);
  //     })
  //     .catch(err => {
  //       console.log('eer', err);
  //       toast.error('Something went wrong: Unable to fetch Identity details!', {
  //         position: 'top-center',
  //         autoClose: 2000,
  //         hideProgressBar: true,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: 'colored',
  //       });
  //     })
  //     .finally(() => {
  //       setLoadingIdentity(false);
  //     });
  // }, [axios, setIdentity]);

  if (loadingIdentity || Object.keys(identity)?.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </div>
    );
  }
  if (
    identity?.attrs?.ADMIN === 'true' ||
    (identity?.attrs?.DOCTOR === 'true' &&
      Cookies.get('ACLOGIN_MODE') === 'healthcare')
  ) {
    return <Healthcare />;
  }
  return <User />;
}
