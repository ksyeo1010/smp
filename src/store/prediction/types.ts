// Action constants here
export const PREDICTION_LOADING = 'PREDICTION_LOADING';
export const PREDICTION_ERROR = 'PREDICTION_ERROR';
export const GET_PREDICTIONS = 'GET_PREDICTIONS';
export const GET_PREDICTION = 'GET_PREDICTION';
export const PREDICTION = 'Prediction';

// Values Type are the values of a file type
export interface ValuesType {
    date: string;
    open: number;
    low: number;
    high: number;
    close: number;
    volume: number;
}

// PredictionType holds the information of a prediction type
export interface PredictionType {
    uuid: string;
    symbol: string;
    predicted_at: string;
    predictions?: ValuesType[];
    forecast?: ValuesType[];
}

// Prediction is list of string
export interface PredictionState {
    preds: PredictionType[];
    selected?: PredictionType;
    success: boolean;
    loading: boolean;
    error: boolean;
    message: string;
}

// Loading Prediction Action
export interface LoadingPredictionAction {
    type: typeof PREDICTION_LOADING;
    loading: boolean;
}

// Error Prediction Action
export interface ErrorPredictionAction {
    type: typeof PREDICTION_ERROR;
    error: boolean;
    message: string;
}

// Get Prediction Action
export interface GetPredictionsAction {
    type: typeof GET_PREDICTIONS;
    preds: PredictionType[];
}

// Get Prediction Action
export interface GetPredictionAction {
    type: typeof GET_PREDICTION;
    pred: PredictionType;
}

// Prediction Action
export interface PredictionAction {
    type: typeof PREDICTION;
    success: boolean;
    pred: PredictionType;
}

export type PredictionActionTypes =
    | LoadingPredictionAction
    | ErrorPredictionAction
    | GetPredictionsAction
    | PredictionAction
    | GetPredictionAction;
