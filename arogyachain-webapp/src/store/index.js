import identityModel from './models/identityModel';
import { createStore } from 'easy-peasy';

const store = createStore({
  identityDetails: identityModel,
});

export default store;
