import React from 'react';
import { hydrate, render } from 'react-dom';
import { Provider } from 'react-redux';
import { history } from './history';

import { Router, BrowserRouter} from 'react-router-dom';
import configureStore from './store/configureStore';
import initialReduxState from './constants/initialState';
import { routes } from './routes';

import './shared/crash';
import './shared/service-worker';
import './shared/vendor';
// NOTE: this isn't ES*-compliant/possible, but works because we use Webpack as a build tool
import './styles/styles.scss';


// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__INITIAL_STATE__
// Allow the passed state to be garbage-collected
delete window.__INITIAL_STATE__

// Create the Redux store
const store = configureStore(preloadedState);

hydrate(
    <Provider store={store}>
        <BrowserRouter>
            {routes}
        </BrowserRouter>
    </Provider>,
    document.getElementById('app')
);
