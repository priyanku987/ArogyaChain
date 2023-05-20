/* eslint-disable no-param-reassign */
import { action } from 'easy-peasy';

const identityModel = {
  identity: {},
  setIdentity: action((state, payload) => {
    state.identity = payload;
  }),
};

export default identityModel;
