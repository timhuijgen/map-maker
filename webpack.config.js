'use strict';

const
    path    = require( 'path' ),
    webpack = require( 'webpack' ),
    _       = require( 'lodash' ),
    argv    = require( 'yargs' ).argv,
    routes  = require( './routes' );

function parseArgv () {
    var args = {};

    for ( var key in argv ) {
        if ( argv.hasOwnProperty( key ) ) {
            args[ key ] = JSON.stringify( argv[ key ] );
        }
    }
    return args;
}

const options = {
    production: {
        entry:   {
            app: routes.JS_SRC_ENTRY
        },
        output:  {
            path:       routes.JS_DEST,
            filename:   routes.JS_SRC_MIN_OUT,
            publicPath: '/'
        },
        resolve: {
            modulesDirectories: [ 'node_modules' ],
            extensions:         [ '', '.js', '.jsx' ]
        },
        module:  {
            loaders: [
                {
                    test:    /\.jsx?$/,
                    loader:  'babel',
                    exclude: /(node_modules)/,
                    query:   {
                        presets: [ 'es2015', 'stage-0' ],
                    }
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin( {
                'process.env': {
                    NODE_ENV: JSON.stringify( 'production' ),
                    argv:     parseArgv()
                }
            } ),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin()
        ]
    },

    development: {
        entry:   [
            'webpack-dev-server/client?http://localhost:3000',
            'webpack/hot/dev-server',
            routes.JS_SRC_ENTRY
        ],
        output:  {
            path:       routes.JS_VIRTUAL_DIR,
            filename:   routes.JS_SRC_OUT,
            publicPath: '/'
        },
        plugins: [
            new webpack.DefinePlugin( {
                'process.env': {
                    NODE_ENV: JSON.stringify( 'development' ),
                    argv:     parseArgv()
                }
            } ),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin()
        ],
        resolve: {
            modulesDirectories: [ 'node_modules' ],
            extensions:         [ '', '.js', '.jsx' ]
        },
        module:  {
            loaders: [
                {
                    test:    /\.jsx?$/,
                    loader:  'babel',
                    exclude: /(node_modules)/,
                    query:   {
                        presets: [ 'es2015', 'stage-0' ]
                    }
                }
            ]
        }
    }
};

module.exports = options;
