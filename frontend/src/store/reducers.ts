import { combineReducers } from '@reduxjs/toolkit';

import { reducer as order } from './../modules/Orders/reducer';

const reducers = combineReducers({
  order,
});

export type RootState = ReturnType<typeof reducers>;

export default reducers;
