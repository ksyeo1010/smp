import {
    SettingsState,
    SettingsActionTypes,
    GET_SETTINGS,
    UPDATE_SETTINGS,
    CHANGE_SETTINGS,
    SETTINGS_LOADING,
    SETTINGS_ERROR,
} from './types';

const initialState: SettingsState = {
    values: {
        alpha_vantange: {},
        prediction: {},
    },
    success: false,
    loading: false,
    error: false,
    message: '',
};

// eslint-disable-next-line import/prefer-default-export
export function settingsReducer(
    state = initialState,
    action: SettingsActionTypes
): SettingsState {
    switch (action.type) {
        case SETTINGS_LOADING:
            return {
                ...state,
                loading: action.loading,
                success: false,
                error: false,
            };
        case SETTINGS_ERROR:
            return {
                ...state,
                error: action.error,
                message: action.message,
                success: false,
                loading: false,
            };
        case GET_SETTINGS:
            return {
                ...state,
                error: false,
                loading: false,
                success: true,
                values: action.settings,
            };
        case UPDATE_SETTINGS:
            return {
                ...state,
                error: false,
                loading: false,
                success: true,
            };
        case CHANGE_SETTINGS:
            state.values[action.section][action.option] = action.value;
            return state;
        default:
            return state;
    }
}
