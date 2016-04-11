'use strict';

import 'console-shim';
import 'es5-shim';
import 'es6-shim';
import Cookies from 'js-cookie';

import Client from './Client';

try {
    let options;

    if ( process && process.env ) {
        if( process.env.argv ) {
            options = process.env.argv;
        }
        if( process.env.NODE_ENV ) {
            options.production = (process.env.NODE_ENV == 'production');
            options.development = (process.env.NODE_ENV == 'development');
        }
    }

    new Client(options);

} catch ( e ) {
    console.error('Exception caught', e);
}