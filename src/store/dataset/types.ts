// Action constants here
export const DATASET_LOADING = 'LOADING_DATASET';
export const DATASET_ERROR = 'DATASET_ERROR';
export const GET_DATASETS = 'GET_DATASETS';
export const SAVE_DATASET = 'SAVE_DATASET';

// Dataset is list of string
export interface DatasetState {
    files: string[];
    loading: boolean;
    error: boolean;
    message: string;
}

// Loading Dataset Action
export interface LoadingDatasetAction {
    type: typeof DATASET_LOADING;
    loading: boolean;
}

// Error Dataset Action
export interface ErrorDatasetAction {
    type: typeof DATASET_ERROR;
    error: boolean;
    message: string;
}

// Get Datasets Action
export interface GetDatasetsAction {
    type: typeof GET_DATASETS;
    files: string[];
}

// Save Dataset Action
export interface SaveDatasetAction {
    type: typeof SAVE_DATASET;
    file: string;
}

export type DatasetActionTypes =
    | LoadingDatasetAction
    | ErrorDatasetAction
    | GetDatasetsAction
    | SaveDatasetAction;
