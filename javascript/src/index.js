'use strict';

import Client from './Client';
//import 'console-shim';
//import 'es5-shim';
//import 'es6-shim';

/**
 * Parse environment options and pass them to the Client
 */
try {
    let options;

    if ( process && process.env ) {
        if ( process.env.argv ) {
            // Any extra arguments
            options = process.env.argv;
            // Check for electron
            options.electron = (process.env.argv['_'] && process.env.argv['_'][0] && process.env.argv['_'][0].indexOf('electron') > -1);
        }
        if ( process.env.NODE_ENV ) {
            // Determine production or development env
            options.production  = (process.env.NODE_ENV == 'production');
            options.development = (process.env.NODE_ENV == 'development');
        }
    }

    new Client( options );

} catch ( e ) {
    console.error( 'Exception caught', e );
}