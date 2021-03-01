import {
    DatasetActionTypes,
    GET_DATASETS,
    SAVE_DATASET,
    DATASET_LOADING,
    DATASET_ERROR,
} from './types';

export function loadingDataset(loading = true): DatasetActionTypes {
    return {
        type: DATASET_LOADING,
        loading,
    };
}

export function errorDataset(message: string): DatasetActionTypes {
    return {
        type: DATASET_ERROR,
        error: true,
        message,
    };
}

export function getDatasets(files: string[]): DatasetActionTypes {
    return {
        type: GET_DATASETS,
        files,
    };
}

export function saveDataset(file: string): DatasetActionTypes {
    return {
        type: SAVE_DATASET,
        file,
    };
}
