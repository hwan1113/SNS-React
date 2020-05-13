import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import App from './app';
import SinglePost from './pages/post';
import Login from './pages/login';
import NotFound from './pages/404';
import { loadUser } from './shared/http';
import { createError } from './actions/error';
import { loginSuccess } from './actions/auth';
import { getFirebaseUser, getFirebaseToken } from './backend/auth';
import configureStore from './store/configureStore'
import { isServer } from './utils/environment';
import OS from './pages/os';

const store = configureStore();
/**
 * This React Router onenter hook helps determine if there's a currently-authenticated user or not
 * @method requireUser
 * @module letters/components
 * @param  {object}    nextState next react router Location descriptor
 * @param  {Function}  replace   replace function
 * @param  {Function}  callback  callback to invoke when ready to transition
 * @return {void}
 */
// We're using the new async/await syntax here:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
async function requireUser(nextState, replace, callback) {
    try {
        // Check to see if there's a currently-authenticated user
        const { user: { authenticated } } = store.getState();
        const isOnLoginPage = nextState.location.pathname === '/login';
        // If there is, we can allow the migration
        if (authenticated) {
            return callback();
        }
        // Otherwise, check firebase to see if there's a user logged in
        const firebaseUser = await getFirebaseUser();
        const fireBaseToken = await getFirebaseToken();
        const noUser = !firebaseUser || !fireBaseToken;
        if (noUser && !isOnLoginPage && !isServer()) {
            replace({
                pathname: '/login'
            });
            return callback();
        }
        // If there's no user BUT we're on the login page, proceed
        if (noUser && isOnLoginPage) {
            return callback();
        }
        // We need to load the actual user, so do so here
        const user = await loadUser(firebaseUser.uid).then(res => res.json());
        store.dispatch(loginSuccess(user, fireBaseToken));
        return callback();
    } catch (err) {
        store.dispatch(createError(err));
        return callback(err);
    }
}
const routesGroup = [
    {
        path: '/',
        component: App,
        exact: true
    },
    {
        path: '/os',
        exact: true,
        component: OS
    },
    {
        path: '/posts/:postId',
        component: SinglePost
        //   fetchInitialData: (path = '') => fetchPopularRepos(path.split('/').pop())
    },
    {
        path: '/login',
        component: Login,
        exact: true
    },
    {
        path: '*',
        component: NotFound
    }
]

/**
 * Routes configuration
 * @module letters/components
 */
export const routes = (
    <Switch>
        {routesGroup.map(({ path, component, exact, ...rest }) => {
            return <Route key={path} path={path} component={component} exact={exact} {...rest} />
        })}
    </Switch>
);
