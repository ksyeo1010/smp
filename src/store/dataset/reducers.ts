import {
    DatasetState,
    DatasetActionTypes,
    GET_DATASET,
    GET_DATASETS,
    SAVE_DATASET,
    DATASET_LOADING,
    DATASET_ERROR,
} from './types';

const initialState: DatasetState = {
    files: [],
    success: false,
    loading: false,
    error: false,
    message: '',
};

const resetState = (state: DatasetState) => {
    state.success = false;
    state.loading = false;
    state.error = false;
    state.message = '';
};

// eslint-disable-next-line import/prefer-default-export
export function datasetReducer(
    state = initialState,
    action: DatasetActionTypes
): DatasetState {
    resetState(state);

    switch (action.type) {
        case DATASET_LOADING:
            return {
                ...state,
                loading: action.loading,
            };
        case DATASET_ERROR:
            return {
                ...state,
                error: action.error,
                message: action.message,
            };
        case GET_DATASETS:
            return {
                ...state,
                files: action.files,
            };
        case GET_DATASET:
            return {
                ...state,
                selected: action.file,
            };
        case SAVE_DATASET:
            return {
                ...state,
                success: action.success,
                selected: action.file,
                files: [...state.files, action.file],
            };
        default:
            return state;
    }
}
