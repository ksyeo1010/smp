import { combineReducers } from 'redux';
import { datasetReducer } from './dataset/reducers';

// From https://redux.js.org/recipes/usage-with-typescript
const rootReducer = combineReducers({
    dataset: datasetReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
