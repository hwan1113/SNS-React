// import { __PRODUCTION__ } from 'environs';
import { resolve } from 'path';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import config from 'config';
import hpp from 'hpp';
import logger from 'morgan';
import responseTime from 'response-time';
import ReactDOMServer from 'react-dom/server';
import serialize from "serialize-javascript"
// import favicon from 'serve-favicon';

import * as firebase from 'firebase-admin';

// Initialize Firebase
firebase.initializeApp({
    // credential: firebase.credential.cert(JSON.parse(process.env.LETTERS_FIREBASE_ADMIN_KEY)),
    //https://firebase.google.com/docs/reference/admin/node/admin.credential
    credential: firebase.credential.applicationDefault(),
    databaseURL: 'https://sns-react.firebaseio.com/'
});

// Our dummy database backend
import DB from '../db/DB';
// Modules explicitly related to React & SSR
import { renderToNodeStream } from 'react-dom/server';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

// Modules from the client-side of things
import configureStore from '../src/store/configureStore';
import initialReduxState from '../src/constants/initialState';
import * as HTML from '../src/components/HTML';
import { routes } from '../src/routes';
import { loginSuccess } from '../src/actions/auth';
import { getPostsForPage } from '../src/actions/posts';
import { createError } from '../src/actions/error';

// Create the express app and database
const app = express();
const backend = DB();

// Add some boilerplate middlware
// app.use(logger(__PRODUCTION__ ? 'combined' : 'dev'));
app.use(helmet.xssFilter({ setOnOldIE: true }));
app.use(responseTime());
app.use(helmet.frameguard());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.hidePoweredBy({ setTo: 'react' }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(hpp());
app.use(cors({ origin: config.get('ORIGINS') }));

// other Route handlers
app.use('/api', backend);
app.use('/static', express.static(resolve(__dirname, '..', 'static')));
// app.use(favicon(resolve(__dirname, '..', 'static', 'assets', 'meta', 'favicon.ico')));
app.use('*', (req, res) => {
        // Only redirect if necessary and if the user isn't on the login page (to prevent a loop)
        const {redirectLocation, originalUrl} = req;
        if (redirectLocation && originalUrl !== '/login') {
            return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        }
        // Create the store server-side using initial state constant
        const store = configureStore(initialReduxState);
        try {
            // We've stored the user id in a cookie named letters-token,
            // so we need to grab that here
            const token = req.cookies['letters-token'];
            if (token) {
                // Get the firebase user from their token
                // const firebaseUser = await firebase.auth().verifyIdToken(token);
                // Normally we'd do something like query the database or send a request to
                // another service/microservice, not the same server, but for our purposes
                // this works
                // const userResponse = await fetch(
                //     `${config.get('ENDPOINT')}/users/${firebaseUser.uid}`
                // );
                // If a user can be found, load data for them
                // if (userResponse.status !== 404) {
                //     const user = await userResponse.json();
                //     // Redux-thunk allows us to wait for promises to finish, so we can dispatch
                //     // async  action creators and wait for them to finish before sending the
                //     // response back down to the browser
                //     await store.dispatch(loginSuccess(user));
                //     await store.dispatch(getPostsForPage());
                // }
            }
        } catch (err) {
            // If the user's token is expired, wipe their token
            if (err.errorInfo.code === 'auth/argument-error') {
                res.clearCookie('letters-token');
                return res.redirect(302, '/login');
            }
            // dispatch the error
            // store.dispatch(createError(err));
        }
        res.setHeader('Content-type', 'text/html');
        // res.write(HTML.start());
        let renderStream = ReactDOMServer.renderToString(
            <Provider store={store}>
                <StaticRouter location={req.url} context={{}}>
                    {routes}
                </StaticRouter>
            </Provider>
        );
        const preloadedState = store.getState()
        HTML.template = HTML.template.replace(/\[SSR_COMPONENt\]/, renderStream)
                     .replace(/\[REDUXSTATE\]/, JSON.stringify(preloadedState).replace(/</g,'\\u003c'))
        // console.log(HTML.template);

        // renderStream.pipe(res, { end: false });
        // renderStream.on('end', () => {
        //     res.write(HTML.end(store.getState()));
        //     res.end();
        // });
        res.send(`<!DOCTYPE html><html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <link rel="stylesheet" href="/static/styles.css" type="text/css" />
            <link rel="stylesheet" href="https://api.mapbox.com/mapbox.js/v3.1.1/mapbox.css" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <title>
                Letters Social | React in Action by Mark Thomas from Manning Publications
            </title>
            <link rel="manifest" href="/static/manifest.json" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <meta name="ROBOTS" content="INDEX, FOLLOW" />
            <meta name="HandheldFriendly" content="True" />
            <meta name="MobileOptimized" content="320" />
            <meta name="theme-color" content="#4469af" />
            <link
                href="https://fonts.googleapis.com/css?family=Open+Sans:400,700,800"
                rel="stylesheet"
            />
        </head>
        <body>
            <div id="app">${renderStream}</div>
            <script id="initialState">
                window.__INITIAL_STATE__ =${JSON.stringify(preloadedState).replace(/</g,'\\u003c')};
            </script>
            <script src="https://cdn.ravenjs.com/3.17.0/raven.min.js" type="text/javascript"></script>
            <script src="https://api.mapbox.com/mapbox.js/v3.1.1/mapbox.js" type="text/javascript"></script>
            <script src="http://localhost:3000/bundle.js" type="text/javascript"></script>
            </body>
        </html>
    `)
    });

// Error handling routes
app.use((req, res, next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
});
app.use((err, req, res) => {
    console.error(err);
    return res.status(err.status || 500).json({
        message: err.message
    });
});

process.on('unhandledRejection', e => {
    console.error(e);
});


module.exports = app;