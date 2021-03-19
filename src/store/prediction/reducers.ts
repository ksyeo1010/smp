import {
    PredictionState,
    PredictionActionTypes,
    GET_PREDICTION,
    GET_PREDICTIONS,
    PREDICTION,
    PREDICTION_LOADING,
    PREDICTION_ERROR,
} from './types';

const initialState: PredictionState = {
    preds: [],
    success: false,
    loading: false,
    error: false,
    message: '',
};

const resetState = (state: PredictionState) => {
    state.success = false;
    state.loading = false;
    state.error = false;
    state.message = '';
};

// eslint-disable-next-line import/prefer-default-export
export function predictionReducer(
    state = initialState,
    action: PredictionActionTypes
): PredictionState {
    resetState(state);

    switch (action.type) {
        case PREDICTION_LOADING:
            return {
                ...state,
                loading: action.loading,
            };
        case PREDICTION_ERROR:
            return {
                ...state,
                error: action.error,
                message: action.message,
            };
        case GET_PREDICTIONS:
            return {
                ...state,
                preds: action.preds,
            };
        case GET_PREDICTION:
            return {
                ...state,
                selected: action.pred,
            };
        case PREDICTION:
            return {
                ...state,
                success: action.success,
                selected: action.pred,
                preds: [...state.preds, action.pred],
            };
        default:
            return state;
    }
}
