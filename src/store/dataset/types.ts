// Action constants here
export const DATASET_LOADING = 'DATASET_LOADING';
export const DATASET_ERROR = 'DATASET_ERROR';
export const GET_DATASETS = 'GET_DATASETS';
export const SAVE_DATASET = 'SAVE_DATASET';

// Values Type are the values of a file type
export interface ValuesType {
    dates: string[];
    open: number[];
    low: number[];
    high: number[];
    close: number[];
    volume: number[];
}

// FileType holds the information of a file type
export interface FileType {
    name: string;
    modified: string;
    size: number;
    values?: ValuesType;
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
    success: boolean;
    files: FileType[];
}

// Save Dataset Action
export interface SaveDatasetAction {
    type: typeof SAVE_DATASET;
    success: boolean;
    file: FileType;
}

export type DatasetActionTypes =
    | LoadingDatasetAction
    | ErrorDatasetAction
    | GetDatasetsAction
    | SaveDatasetAction;
