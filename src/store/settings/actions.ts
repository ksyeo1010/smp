import {
    SettingsActionTypes,
    SettingsType,
    GET_SETTINGS,
    UPDATE_SETTINGS,
    SETTINGS_LOADING,
    SETTINGS_ERROR,
    OptionsType,
    CHANGE_SETTINGS,
} from './types';

export function loadingSettings(loading = true): SettingsActionTypes {
    return {
        type: SETTINGS_LOADING,
        loading,
    };
}

export function errorSettings(message: string): SettingsActionTypes {
    return {
        type: SETTINGS_ERROR,
        error: true,
        message,
    };
}

export function getSettings(settings: SettingsType): SettingsActionTypes {
    return {
        type: GET_SETTINGS,
        settings,
    };
}

export function updateSettings(settings: SettingsType): SettingsActionTypes {
    return {
        type: UPDATE_SETTINGS,
        settings,
    };
}

export function changeSettings(
    section: keyof SettingsType,
    option: keyof OptionsType,
    value: string | number
): SettingsActionTypes {
    return {
        type: CHANGE_SETTINGS,
        section,
        option,
        value,
    };
}
