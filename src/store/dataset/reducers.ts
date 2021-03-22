import {
    DatasetState,
    DatasetActionTypes,
    GET_DATASET,
    GET_DATASETS,
    SAVE_DATASET,
    UPDATE_DATASET,
    DELETE_DATASET,
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

// eslint-disable-next-line import/prefer-default-export
export function datasetReducer(
    state = initialState,
    action: DatasetActionTypes
): DatasetState {
    switch (action.type) {
        case DATASET_LOADING:
            return {
                ...state,
                loading: action.loading,
                success: false,
                error: false,
            };
        case DATASET_ERROR:
            return {
                ...state,
                error: action.error,
                message: action.message,
                success: false,
                loading: false,
            };
        case GET_DATASETS:
            return {
                ...state,
                error: false,
                loading: false,
                files: action.files,
            };
        case GET_DATASET:
            return {
                ...state,
                error: false,
                loading: false,
                selected: action.file,
            };
        case SAVE_DATASET:
            return {
                ...state,
                error: false,
                loading: false,
                success: action.success,
                selected: action.file,
                files: [
                    ...state.files.filter(
                        (f) => f.symbol !== action.file.symbol
                    ),
                    action.file,
                ],
            };
        case UPDATE_DATASET:
            return {
                ...state,
                error: false,
                loading: false,
                selected: action.file,
                files: [
                    ...state.files.filter(
                        (f) => f.symbol !== action.file.symbol
                    ),
                    action.file,
                ],
            };
        case DELETE_DATASET:
            // eslint-disable-next-line no-nested-ternary
            state.selected = state.selected
                ? state.selected.symbol !== action.symbol
                    ? state.selected
                    : undefined
                : undefined;
            return {
                ...state,
                error: false,
                loading: false,
                files: state.files.filter((f) => f.symbol !== action.symbol),
            };
        default:
            return state;
    }
}
