// Action constants here
export const DATASET_LOADING = 'DATASET_LOADING';
export const DATASET_ERROR = 'DATASET_ERROR';
export const GET_DATASETS = 'GET_DATASETS';
export const GET_DATASET = 'GET_DATASET';
export const SAVE_DATASET = 'SAVE_DATASET';
export const UPDATE_DATASET = 'UPDATE_DATASET';
export const DELETE_DATASET = 'DELETE_DATASET';

// Values Type are the values of a file type
export interface ValuesType {
    date: string;
    open: number;
    low: number;
    high: number;
    close: number;
    volume: number;
}

// FileType holds the information of a file type
export interface FileType {
    symbol: string;
    modified: string;
    size: number;
    values?: ValuesType[];
}

// Dataset is list of string
export interface DatasetState {
    files: FileType[];
    selected?: FileType;
    success: boolean;
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
    files: FileType[];
}

// Get Dataset Action
export interface GetDatasetAction {
    type: typeof GET_DATASET;
    file: FileType;
}

// Save Dataset Action
export interface SaveDatasetAction {
    type: typeof SAVE_DATASET;
    success: boolean;
    file: FileType;
}

// Update Dataset Action
export interface UpdateDatasetAction {
    type: typeof UPDATE_DATASET;
    file: FileType;
}

// Delete Dataset Action
export interface DeleteDatasetAction {
    type: typeof DELETE_DATASET;
    symbol: string;
}

export type DatasetActionTypes =
    | LoadingDatasetAction
    | ErrorDatasetAction
    | GetDatasetsAction
    | SaveDatasetAction
    | GetDatasetAction
    | UpdateDatasetAction
    | DeleteDatasetAction;
