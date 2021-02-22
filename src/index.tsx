import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import App from './App';
import rootReducer from './store';

// create store with thunk middleware
const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
