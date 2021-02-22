import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import axios from 'axios';

import { RootState } from './store';

import { getDatasets } from './store/dataset/actions';

// default type
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;

export const thunkGetDatasets = (): AppThunk => async (dispatch) => {
    try {
        const res = (await axios.get('http://localhost:8888/datasets')).data;
        dispatch(getDatasets(res.data));
        // eslint-disable-next-line no-empty
    } catch (e) {}
};
