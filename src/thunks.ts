import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import axios from 'axios';

import { RootState } from './store';

import {
    errorDataset,
    getDataset,
    getDatasets,
    loadingDataset,
    saveDataset,
} from './store/dataset/actions';
import {
    loadingPrediction,
    errorPrediction,
    getPredictions,
    getPrediction,
    prediction,
} from './store/prediction/action';

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

export const thunkGetDataset = (
    symbol: string,
    range?: number
): AppThunk => async (dispatch) => {
    try {
        dispatch(loadingDataset());
        let query = `http://localhost:8888/dataset/${symbol}`;
        if (range !== undefined) {
            query += `?range=${range}`;
        }
        const res = (await axios.get(query)).data;
        if (res.success) dispatch(getDataset(res.data));
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

export const thunkPredict = (symbol: string): AppThunk => async (dispatch) => {
    try {
        dispatch(loadingPrediction());
        const res = (
            await axios.post('http://localhost:8888/prediction', { symbol })
        ).data;
        if (res.success) dispatch(prediction(res.data));
        else dispatch(errorPrediction(res.error));
    } catch (e) {
        dispatch(errorPrediction(e.message));
    }
};

export const thunkGetPredictions = (): AppThunk => async (dispatch) => {
    try {
        dispatch(loadingPrediction());
        const res = (await axios.get('http://localhost:8888/predictions')).data;
        if (res.success) dispatch(getPredictions(res.data));
        else dispatch(errorPrediction(res.error));
    } catch (e) {
        dispatch(errorPrediction(e.message));
    }
};

export const thunkGetPrediction = (uuid: string): AppThunk => async (
    dispatch
) => {
    try {
        dispatch(loadingPrediction());
        const res = (
            await axios.get(`http://localhost:8888/predictions/${uuid}`)
        ).data;
        if (res.success) dispatch(getPrediction(res.data));
        else dispatch(errorPrediction(res.error));
    } catch (e) {
        dispatch(errorPrediction(e.message));
    }
};
