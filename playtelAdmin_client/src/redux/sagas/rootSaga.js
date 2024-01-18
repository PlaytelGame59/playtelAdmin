// rootSaga.js
import { all } from 'redux-saga/effects';
import playerSaga from './playerSaga'
// Add more sagas as needed

export default function* rootSaga() {
  yield all([
    playerSaga()
  ]);
} 
