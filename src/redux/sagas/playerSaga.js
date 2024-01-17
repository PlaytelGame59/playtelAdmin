// playerSaga.js

import { put, call, takeLatest, takeEvery } from 'redux-saga/effects';
import * as actionTypes from '../ActionTypes/actionTypes'

import { postRequest } from '../../utils/service';

function* getPlayerData() {
  try {
    yield put({
      type: actionTypes.SET_IS_LOADING,
      payload: true
    })
    const response = yield postRequest({
      url: '',
      data: ''
    })

    if (response) {
      yield put({
        type: actionTypes.SET_PLAYER_DATA,
        payload: response.data
      })
    }
    yield put({
      type: actionTypes.SET_IS_LOADING,
      payload: false
    })
  } catch (error) {
    console.log(error)
    yield put({
      type: actionTypes.SET_IS_LOADING,
      payload: false
    })
  }
}

export default function* playerSaga() {
  yield takeEvery(actionTypes.FETCH_PLAYER_DATA_REQUEST, getPlayerData)
}



