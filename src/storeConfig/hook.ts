import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {RootState} from 'reducer/appReducer';
import type {AppDispatch} from './types';
import {Dispatch} from '@reduxjs/toolkit';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = (): Dispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
