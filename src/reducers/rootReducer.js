import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore';
import { firebaseReducer } from 'react-redux-firebase';

import authReducer from './authReducer';
import productReducer from './productReducer';
import transactionReducer from './transactionReducer'

const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  transactions: transactionReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer,
});

export default rootReducer;
