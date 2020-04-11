//Make ES2016 syntax available
require('esm')(module)
//All subsequent files required by node with the extensions .es6, .es, .jsx and .js will be transformed by Babel
require('@babel/register');

try {
    module.exports = require('./server/run');
} catch (err) {
    console.error(err);
}

//RHIE RHIE RHIE RHIE