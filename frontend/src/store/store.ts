import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import reducer from './reducers';
import saga from './sagas';

const sagaMiddleware = createSagaMiddleware();
const middleware = [logger, sagaMiddleware];

export const store = configureStore({
  reducer,
  middleware,
});
sagaMiddleware.run(saga);

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
