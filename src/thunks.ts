import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import axios from 'axios';

import { RootState } from './store';

import {
    errorDataset,
    getDatasets,
    loadingDataset,
    saveDataset,
} from './store/dataset/actions';

// default type
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;

// set axios defaults
axios.defaults.validateStatus = () => {
    return true;
};

export const thunkGetDatasets = (): AppThunk => async (dispatch) => {
    try {
        dispatch(loadingDataset());
        const res = (await axios.get('http://localhost:8888/datasets')).data;
        if (res.success) dispatch(getDatasets(res.data));
        else dispatch(errorDataset(res.error));
    } catch (e) {
        dispatch(errorDataset(e.message));
    }
};

export const thunkSaveDataset = (symbol: string): AppThunk => async (
    dispatch
) => {
    try {
        dispatch(loadingDataset());
        const res = (
            await axios.post('http://localhost:8888/dataset', { symbol })
        ).data;
        if (res.success) dispatch(saveDataset(res.data));
        else dispatch(errorDataset(res.error));
    } catch (e) {
        dispatch(errorDataset(e.message));
    }
};
