// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../redux/Reducers/rootReducer'; // ../redux/Reducers/rootReducer
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../redux/sagas/rootSaga';  // ../redux/sagas/rootSaga

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;
