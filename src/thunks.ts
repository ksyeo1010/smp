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
    deleteDataset,
    updateDataset,
} from './store/dataset/actions';
import {
    loadingPrediction,
    errorPrediction,
    getPredictions,
    getPrediction,
    prediction,
    deletePrediction,
} from './store/prediction/actions';
import {
    loadingSettings,
    errorSettings,
    getSettings,
    updateSettings,
    changeSettings,
} from './store/settings/actions';
import { OptionsType, SettingsType } from './store/settings/types';

// default type
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;

const SERVER_URL = 'http://localhost:8888';
// set axios defaults
axios.defaults.validateStatus = () => {
    return true;
};

export const thunkGetDatasets = (): AppThunk => async (dispatch) => {
    try {
        dispatch(loadingDataset());
        const res = (await axios.get(`${SERVER_URL}/datasets`)).data;
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
        let query = `${SERVER_URL}/dataset/${symbol}`;
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
        const res = (await axios.post(`${SERVER_URL}/dataset`, { symbol }))
            .data;
        if (res.success) dispatch(saveDataset(res.data));
        else dispatch(errorDataset(res.error));
    } catch (e) {
        dispatch(errorDataset(e.message));
    }
};

export const thunkUpdateDataset = (symbol: string): AppThunk => async (
    dispatch
) => {
    try {
        dispatch(loadingDataset());
        const res = (await axios.put(`${SERVER_URL}/dataset`, { symbol })).data;
        if (res.success) dispatch(updateDataset(res.data));
        else dispatch(errorDataset(res.error));
    } catch (e) {
        dispatch(errorDataset(e.message));
    }
};

export const thunkDeleteDataset = (symbol: string): AppThunk => async (
    dispatch
) => {
    try {
        dispatch(loadingDataset());
        const res = (await axios.delete(`${SERVER_URL}/dataset/${symbol}`))
            .data;
        if (res.success) dispatch(deleteDataset(symbol));
        else dispatch(errorDataset(res.error));
    } catch (e) {
        dispatch(errorDataset(e));
    }
};

export const thunkPredict = (symbol: string): AppThunk => async (dispatch) => {
    try {
        dispatch(loadingPrediction());
        const res = (await axios.post(`${SERVER_URL}/prediction`, { symbol }))
            .data;
        if (res.success) dispatch(prediction(res.data));
        else dispatch(errorPrediction(res.error));
    } catch (e) {
        dispatch(errorPrediction(e.message));
    }
};

export const thunkGetPredictions = (): AppThunk => async (dispatch) => {
    try {
        dispatch(loadingPrediction());
        const res = (await axios.get(`${SERVER_URL}/predictions`)).data;
        if (res.success) dispatch(getPredictions(res.data));
        else dispatch(errorPrediction(res.error));
    } catch (e) {
        dispatch(errorPrediction(e.message));
    }
};

export const thunkGetPrediction = (
    uuid: string,
    range?: number
): AppThunk => async (dispatch) => {
    try {
        dispatch(loadingPrediction());
        let query = `${SERVER_URL}/prediction/${uuid}`;
        if (range !== undefined) {
            query += `?range=${range}`;
        }
        const res = (await axios.get(query)).data;
        if (res.success) dispatch(getPrediction(res.data));
        else dispatch(errorPrediction(res.error));
    } catch (e) {
        dispatch(errorPrediction(e.message));
    }
};

export const thunkDeletePrediction = (uuid: string): AppThunk => async (
    dispatch
) => {
    try {
        dispatch(loadingPrediction());
        const res = (await axios.delete(`${SERVER_URL}/prediction/${uuid}`))
            .data;
        if (res.success) dispatch(deletePrediction(uuid));
        else dispatch(errorPrediction(res.error));
    } catch (e) {
        dispatch(errorPrediction(e));
    }
};

export const thunkGetSettings = (): AppThunk => async (dispatch) => {
    try {
        dispatch(loadingSettings());
        const res = (await axios.get(`${SERVER_URL}/settings`)).data;
        if (res.success) dispatch(getSettings(res.data));
        else dispatch(errorSettings(res.error));
    } catch (e) {
        dispatch(errorSettings(e));
    }
};

export const thunkUpdateSettings = (settings: SettingsType): AppThunk => async (
    dispatch
) => {
    try {
        dispatch(loadingSettings());
        const res = (await axios.post(`${SERVER_URL}/settings`, { settings }))
            .data;
        if (res.success) dispatch(updateSettings(res.data));
        else dispatch(errorSettings(res.error));
    } catch (e) {
        dispatch(errorSettings(e));
    }
};

export const thunkChangeSettings = (
    section: keyof SettingsType,
    option: keyof OptionsType,
    value: string | number
): AppThunk => async (dispatch) => {
    dispatch(changeSettings(section, option, value));
};
