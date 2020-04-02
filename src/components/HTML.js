export const template = `<!DOCTYPE html><html lang="en">
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
            <div id="app">[SSR_COMPONENt]</div>
            <script id="initialState">
                window.__INITIAL_STATE__ =[REDUXSTATE];
            </script>
            <script src="https://cdn.ravenjs.com/3.17.0/raven.min.js" type="text/javascript"></script>
            <script src="https://api.mapbox.com/mapbox.js/v3.1.1/mapbox.js" type="text/javascript"></script>
            <script src="http://localhost:3000/bundle.js" type="text/javascript"></script>
            </body>
        </html>
    `

/**
 * Write the end content for SSR
 * @method end
 * @param  {object} reduxState redux state
 * @return {string}
 */
// export const end = reduxState => {
//     return `</div>
//         <script id="initialState">
//             window.__INITIAL_STATE__ = ${JSON.stringify(reduxState)};
//         </script>
//         <script src="https://cdn.ravenjs.com/3.17.0/raven.min.js" type="text/javascript"></script>
//         <script src="https://api.mapbox.com/mapbox.js/v3.1.1/mapbox.js" type="text/javascript"></script>
//         <script src="http://localhost:3000/bundle.js" type="text/javascript"></script>
//         </body>
//     </html>`;
// };
