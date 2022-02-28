import { useSelector } from 'react-redux';
import { RootState } from './reducers';

type StateSelector<T> = (state: RootState) => T;
type EqualityFn<T> = (left: T, right: T) => boolean;

export const useAppSelector = <T>(selector: StateSelector<T>, equalityFn?: EqualityFn<T>) => useSelector(selector, equalityFn);
