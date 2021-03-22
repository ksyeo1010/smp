import {
    PredictionActionTypes,
    PredictionType,
    GET_PREDICTION,
    DELETE_PREDICTION,
    GET_PREDICTIONS,
    PREDICTION,
    PREDICTION_LOADING,
    PREDICTION_ERROR,
} from './types';

export function loadingPrediction(loading = true): PredictionActionTypes {
    return {
        type: PREDICTION_LOADING,
        loading,
    };
}

export function errorPrediction(message: string): PredictionActionTypes {
    return {
        type: PREDICTION_ERROR,
        error: true,
        message,
    };
}

export function getPredictions(preds: PredictionType[]): PredictionActionTypes {
    return {
        type: GET_PREDICTIONS,
        preds,
    };
}

export function getPrediction(pred: PredictionType): PredictionActionTypes {
    return {
        type: GET_PREDICTION,
        pred,
    };
}

export function deletePrediction(uuid: string): PredictionActionTypes {
    return {
        type: DELETE_PREDICTION,
        uuid,
    };
}

export function prediction(pred: PredictionType): PredictionActionTypes {
    return {
        type: PREDICTION,
        success: true,
        pred,
    };
}
