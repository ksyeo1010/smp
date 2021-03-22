// Action constants here
export const SETTINGS_LOADING = 'SETTINGS_LOADING';
export const SETTINGS_ERROR = 'SETTINGS_ERROR';
export const GET_SETTINGS = 'GET_SETTINGS';
export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';
export const CHANGE_SETTINGS = 'CHANGE_SETTINGS';

// OptionsType is key value store
export interface OptionsType {
    [Key: string]: string | number;
}

// SettingsType holds the information of a settings type
export interface SettingsType {
    alpha_vantange: OptionsType;
    prediction: OptionsType;
}

// SettingsState is list of settings
export interface SettingsState {
    values: SettingsType;
    success: boolean;
    loading: boolean;
    error: boolean;
    message: string;
}

// Loading Settings Action
export interface LoadingSettingsAction {
    type: typeof SETTINGS_LOADING;
    loading: boolean;
}

// Error Settings Action
export interface ErrorSettingsAction {
    type: typeof SETTINGS_ERROR;
    error: boolean;
    message: string;
}

// Get Settings Action
export interface GetSettingsAction {
    type: typeof GET_SETTINGS;
    settings: SettingsType;
}

// Update Settings Action
export interface UpdateSettingsAction {
    type: typeof UPDATE_SETTINGS;
    settings: SettingsType;
}

// Change Settings Action
export interface ChangeSettingsAction {
    type: typeof CHANGE_SETTINGS;
    section: keyof SettingsType;
    option: keyof OptionsType;
    value: string | number;
}

export type SettingsActionTypes =
    | LoadingSettingsAction
    | ErrorSettingsAction
    | GetSettingsAction
    | UpdateSettingsAction
    | ChangeSettingsAction;
