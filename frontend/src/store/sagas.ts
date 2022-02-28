import { all, fork } from 'redux-saga/effects';

export default function* onionSagas() {
  yield all([].map(fork));
}
