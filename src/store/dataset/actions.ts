import { GET_DATASETS, DatasetActionTypes } from './types';

// eslint-disable-next-line import/prefer-default-export
export function getDatasets(files: string[]): DatasetActionTypes {
    return {
        type: GET_DATASETS,
        files,
    };
}
