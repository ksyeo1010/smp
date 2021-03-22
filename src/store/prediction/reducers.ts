import {
    PredictionState,
    PredictionActionTypes,
    GET_PREDICTION,
    DELETE_PREDICTION,
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

// eslint-disable-next-line import/prefer-default-export
export function predictionReducer(
    state = initialState,
    action: PredictionActionTypes
): PredictionState {
    switch (action.type) {
        case PREDICTION_LOADING:
            return {
                ...state,
                loading: action.loading,
                error: false,
                success: false,
            };
        case PREDICTION_ERROR:
            return {
                ...state,
                error: action.error,
                message: action.message,
                loading: false,
                success: false,
            };
        case GET_PREDICTIONS:
            return {
                ...state,
                error: false,
                loading: false,
                preds: action.preds,
            };
        case GET_PREDICTION:
            return {
                ...state,
                error: false,
                loading: false,
                selected: action.pred,
            };
        case DELETE_PREDICTION:
            // eslint-disable-next-line no-nested-ternary
            state.selected = state.selected
                ? state.selected.uuid !== action.uuid
                    ? state.selected
                    : undefined
                : undefined;
            return {
                ...state,
                error: false,
                loading: false,
                preds: state.preds.filter((p) => p.uuid !== action.uuid),
            };
        case PREDICTION:
            return {
                ...state,
                error: false,
                loading: false,
                success: action.success,
                selected: action.pred,
                preds: [...state.preds, action.pred],
            };
        default:
            return state;
    }
}
