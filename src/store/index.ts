import { combineReducers } from 'redux';
import { datasetReducer } from './dataset/reducers';
import { predictionReducer } from './prediction/reducers';
import { settingsReducer } from './settings/reducers';

// From https://redux.js.org/recipes/usage-with-typescript
const rootReducer = combineReducers({
    dataset: datasetReducer,
    prediction: predictionReducer,
    settings: settingsReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
