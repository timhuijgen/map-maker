'use strict';

/**
 * Imports
 */

const
    gulp             = require( 'gulp' ),
    gutil            = require( 'gulp-util' ),
    sass             = require( 'gulp-sass' ),
    sourcemaps       = require( 'gulp-sourcemaps' ),
    autoprefix       = require( 'gulp-autoprefixer' ),
    htmlreplace      = require( 'gulp-html-replace' ),
    imagemin         = require( 'gulp-imagemin' ),
    order            = require( 'gulp-order' ),
    concat           = require( 'gulp-concat' ),
    uglify           = require( 'gulp-uglify' ),
    rename           = require( 'gulp-rename' ),

    yargs            = require( 'yargs' ).argv,
    _                = require( 'lodash' ),
    webpack          = require( 'webpack' ),
    WebpackDevServer = require( 'webpack-dev-server' ),
    webpackConfig    = require( './webpack.config.js' ),
    browserSync      = require( 'browser-sync' ),
    electron         = require( 'electron-prebuilt' ),
    packager         = require( 'electron-packager'),
    childProcess     = require( 'child_process'),

    routes           = require( './routes' );

let PRODUCTION = false,
    testUri    = 'localhost',
    testPort   = 3000,
    child      = null,
    auto_restart = false,
    use_electron = false;

gulp.task( 'production', function () {
    PRODUCTION = true;
} );

gulp.task( 'electron', function() {
    use_electron = true;
});

/**
 * Client tasks
 */

gulp.task('run', ['client:_build', 'watch_all'], function() {
    child = childProcess.spawn(electron, [routes.BUILD_DIR], {
        env: { NODE_ENV: 'development' },
        cwd: __dirname,
        detached: false, // set true to leave app open after terminating cmd
        stdio: [null, null, null, 'ipc']
    });

    child.on('error', function(reason) {
        console.log('electron child error', reason);
    });

    child.on('close', function(reason) {
        child = null;
        if (auto_restart) run('run');
        else process.exit(0);
    });

    child.unref();

});

gulp.task('reload', function() {
    if (child) child.send('reload');
});

gulp.task( 'client:_build', function (cb) {
    let config = webpackConfig.production;
    config.externals = {electron: 'commonjs electron', remote: 'commonjs remote'};
    webpack( config, function ( err, stats ) {
        if ( err ) {
            throw new gutil.PluginError( 'build:client', err );
        }
        gutil.log( '[build:client]', stats.toString( {colors: true} ) );
        if (child) child.send('reload');
        cb();
    } );
} );

gulp.task( 'client:watch', function () {
    let config = webpackConfig.development;
    config.externals = {electron: 'electron', remote: 'remote'};
    new WebpackDevServer( webpack( config ), {
        contentBase:        routes.HTML_DEST,
        publicPath:         config.output.publicPath,
        stats:              {colors: true},
        noInfo:             true,
        historyApiFallback: true,
        hot:                true,
        inline:             true
    } ).listen( testPort, testUri, function ( err ) {
        if ( err ) {
            throw new gutil.PluginError( 'watch:client', err );
        }
        gutil.log( '[webpack-dev-server]', 'Dev server running on ' + testUri + ':' + testPort );
    } );
} );

// Run browsersync before the webpackDevServer or browsersync will start on another port
gulp.task( 'browsersync', function () {
    browserSync.init( {
        proxy:  {
            target: testUri + ':' + testPort,
            ws:     true
        },
        notify: false,
        open:   false
    } );
} );

gulp.task( 'place_css', function () {
    // SRC
    gulp.src( routes.SASS_DIR )
        .pipe( sourcemaps.init() )
        .pipe( sass( {outputStyle: 'compressed'} ).on( 'error', sass.logError ) )
        .pipe( autoprefix( [ 'last 1 version', '> 1%', 'ie 9' ] ) )
        .pipe( sourcemaps.write( '.' ) )
        .pipe( gulp.dest( routes.CSS_DEST ) )
        .pipe( browserSync.stream( {match: '**/*.css'} ) );

    // LIB
    return gulp.src( routes.CSS_DIR )
        .pipe( sourcemaps.init() )
        .pipe( autoprefix( [ 'last 1 version', '> 1%', 'ie 9' ] ) )
        .pipe( concat( routes.CSS_LIB_OUT ) )
        .pipe( sourcemaps.write( '.' ) )
        .pipe( gulp.dest( routes.CSS_DEST ) )
        .pipe( browserSync.stream( {match: '**/*.css'} ) );
} );

gulp.task( 'watch_style', function () {
    gulp.watch( routes.SASS_DIR, [ 'place_css' ] );
    gulp.watch( routes.CSS_DIR, [ 'place_css' ] );
} );

gulp.task( 'place_images', function () {
    return gulp.src( routes.IMAGE_DIR )
        .pipe( imagemin() )
        .pipe( gulp.dest( routes.IMAGE_DEST ) );
} );

gulp.task( 'watch_images', function () {
    gulp.watch( routes.IMAGE_DIR, [ 'place_images' ] );
} );

gulp.task( 'place_fonts', function () {
    return gulp.src( routes.FONTS_DIR )
        .pipe( gulp.dest( routes.FONTS_DEST ) );
} );

gulp.task( 'place_lib', function () {
    if ( PRODUCTION ) {
        return gulp.src( routes.JS_LIB_DIR )
            .pipe( order( [ 'jquery.min.js', 'jquery-ui.js', 'bootstrap.min.js' ] ) )
            .pipe( concat( routes.JS_LIB_MIN_OUT ) )
            .pipe( uglify() )
            .pipe( gulp.dest( routes.JS_DEST ) );
    } else {
        return gulp.src( routes.JS_LIB_DIR )
            .pipe( sourcemaps.init() )
            .pipe( order( [ 'jquery.min.js', 'jquery-ui.js', 'bootstrap.min.js' ] ) )
            .pipe( concat( routes.JS_LIB_OUT ) )
            .pipe( sourcemaps.write( '.' ) )
            .pipe( gulp.dest( routes.JS_DEST ) )
            .pipe( browserSync.reload( {stream: true} ) );
    }
} );

gulp.task( 'watch_lib', function () {
    gulp.watch( routes.JS_ALL, [ 'place_lib' ] );
} );

gulp.task( 'place_html', function () {
    var _PRODUCTION = PRODUCTION;
    if(use_electron) {
        _PRODUCTION = true;
    }
    let clientLocation = (_PRODUCTION) ? routes.JS_PUBLIC_SRC_MIN : routes.JS_SRC_OUT;
    let libLocation    = (_PRODUCTION) ? routes.JS_LIB_MIN_DEST : routes.JS_LIB_DEST;

    let cf = {
        'lib':    libLocation,
        'client': clientLocation
    };

    if(!use_electron) {
        cf['fake-electron'] = 'fake-electron.js';
    }

    return gulp.src( routes.HTML_SRC )
        .pipe( htmlreplace( cf ) )
        .pipe( gulp.dest( routes.HTML_DEST ) )
        .pipe( browserSync.reload( {stream: true} ) );
} );

gulp.task( 'watch_html', function () {
    gulp.watch( routes.HTML_SRC, [ 'place_html' ] );
} );

gulp.task( 'place_files', function () {
    return gulp.src( routes.FILES_DIR )
        .pipe( gulp.dest( routes.FILES_DEST ) );
} );

gulp.task( 'place_etc', [ 'place_htaccess' ], function () {
    return gulp.src( [ routes.ETC_DIR, '!' + routes.HTACCESS ] )
        .pipe( gulp.dest( routes.ETC_DEST ) );
} );

gulp.task( 'place_htaccess', function () {
    return gulp.src( routes.HTACCESS )
        .pipe( rename( '.htaccess' ) )
        .pipe( gulp.dest( routes.ETC_DEST ) );
} );

gulp.task( 'watch_all', function() {
    gulp.watch( routes.ASSETS_ALL, ['reload'] );
    gulp.watch( routes.JS_SRC_FILES, ['client:_build'] )
} );

gulp.task( 'resources:build', [ 'place_html', 'place_lib', 'place_css', 'place_fonts', 'place_images', 'place_files', 'place_etc' ] );
gulp.task( 'resources:watch', [ 'watch_html', 'watch_lib', 'watch_style', 'watch_images' ] );

gulp.task( 'default', [ 'client' ] );
gulp.task( 'client:build', [ 'client' ] );
gulp.task( 'client', [ 'production', 'resources:build', 'client:_build' ] );
gulp.task( 'client:dev', [ 'browsersync', 'resources:build', 'resources:watch', 'client:watch' ] );
gulp.task( 'client:dev-electron', [ 'electron', 'client', 'resources:watch', 'run' ] );