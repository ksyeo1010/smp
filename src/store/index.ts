import { combineReducers } from 'redux';
import { datasetReducer } from './dataset/reducers';
import { predictionReducer } from './prediction/reducers';

// From https://redux.js.org/recipes/usage-with-typescript
const rootReducer = combineReducers({
    dataset: datasetReducer,
    prediction: predictionReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
