// Action constants here
export const GET_DATASETS = 'GET_DATASETS';

// Dataset is list of string
export interface DatasetState {
    files: string[];
}

// Get Datasets Action
export interface GetDatasetAction {
    type: typeof GET_DATASETS;
    files: string[];
}

export type DatasetActionTypes = GetDatasetAction;
