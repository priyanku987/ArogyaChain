/* eslint-disable no-param-reassign */
import Axios from 'axios';
import { createContext, useContext, useMemo } from 'react';

export const AxiosContext = createContext(undefined);

const url = process.env.REACT_APP_BACKEND_BASE_URL;

export function AxiosProvider({ children }) {
  const axios = useMemo(() => {
    const myAxios = Axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
      baseURL: url,
    });

    // attach access token to outgoing requests
    // myAxios.interceptors.request.use(config => {
    //   if (certificate && privateKey) {
    //     config.headers.ACCertificate = certificate;
    //     config.headers.ACPrivateKey = privateKey;
    //     config.headers.ACMspId = 'MohfwMSP'; // temp
    //   }
    //   return config;
    // });

    return myAxios;
  }, []);

  return (
    <AxiosContext.Provider value={axios}>{children}</AxiosContext.Provider>
  );
}

/**
 *
 * @returns {Axios}
 */
export function useAxios() {
  return useContext(AxiosContext);
}
