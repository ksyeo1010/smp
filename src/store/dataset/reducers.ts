import { GET_DATASETS, DatasetState, DatasetActionTypes } from './types';

const initialState: DatasetState = {
    files: [],
};

// eslint-disable-next-line import/prefer-default-export
export function datasetReducer(
    state = initialState,
    action: DatasetActionTypes
): DatasetState {
    switch (action.type) {
        case GET_DATASETS:
            return {
                files: action.files,
            };
        default:
            return state;
    }
}
