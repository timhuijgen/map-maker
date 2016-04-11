'use strict';

/**
 * Imports
 */

const
    gulp             = require('gulp'),
    gutil            = require('gulp-util'),
    sass             = require('gulp-sass'),
    sourcemaps       = require('gulp-sourcemaps'),
    autoprefix       = require('gulp-autoprefixer'),
    htmlreplace      = require('gulp-html-replace'),
    imagemin         = require('gulp-imagemin'),
    order            = require('gulp-order'),
    concat           = require('gulp-concat'),
    uglify           = require('gulp-uglify'),
    rename           = require('gulp-rename'),

    yargs            = require('yargs').argv,
    _                = require('lodash'),
    webpack          = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    webpackConfig    = require('./webpack.config.js'),
    browserSync      = require('browser-sync'),

    routes           = require('./routes');

let PRODUCTION = false,
    testUri    = 'localhost',
    testPort   = 3000;

gulp.task('production', function() {
    PRODUCTION = true;
});

/**
 * Client tasks
 */

gulp.task('client:_build', function() {
    let config = webpackConfig.production;

    webpack(config, function( err, stats ) {
        if ( err ) {
            throw new gutil.PluginError('build:client', err);
        }
        gutil.log('[build:client]', stats.toString({colors: true}));
    });
});

gulp.task('client:watch', function() {
    let config = webpackConfig.development;

    new WebpackDevServer(webpack(config), {
        contentBase:        routes.HTML_DEST,
        publicPath:         config.output.publicPath,
        stats:              {colors: true},
        noInfo:             true,
        historyApiFallback: true,
        hot:                true,
        inline:             true
    }).listen(testPort, testUri, function( err ) {
        if ( err ) {
            throw new gutil.PluginError('watch:client', err);
        }
        gutil.log('[webpack-dev-server]', 'Dev server running on ' + testUri + ':' + testPort);
    });
});

// Run browsersync before the webpackDevServer or browsersync will start on another port
gulp.task('browsersync', function() {
    browserSync.init({
        proxy: {
            target: testUri + ':' + testPort,
            ws:     true
        },
        notify: false,
        open:   false
    });
});

gulp.task('place_css', function() {
    // SRC
    gulp.src(routes.SASS_DIR)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefix([ 'last 1 version', '> 1%', 'ie 9' ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(routes.CSS_DEST))
    .pipe(browserSync.stream({match: '**/*.css'}));

    // LIB
    gulp.src(routes.CSS_DIR)
    .pipe(sourcemaps.init())
    .pipe(autoprefix([ 'last 1 version', '> 1%', 'ie 9' ]))
    .pipe(concat(routes.CSS_LIB_OUT))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(routes.CSS_DEST))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('watch_style', function() {
    gulp.watch(routes.SASS_DIR, [ 'place_css' ]);
    gulp.watch(routes.CSS_DIR, [ 'place_css' ]);
});

gulp.task('place_images', function() {
    gulp.src(routes.IMAGE_DIR)
    .pipe(imagemin())
    .pipe(gulp.dest(routes.IMAGE_DEST));
});

gulp.task('watch_images', function() {
    gulp.watch(routes.IMAGE_DIR, [ 'place_images' ]);
});

gulp.task('place_fonts', function() {
    gulp.src(routes.FONTS_DIR)
    .pipe(gulp.dest(routes.FONTS_DEST));
});

gulp.task('place_lib', function() {
    if ( PRODUCTION ) {
        gulp.src(routes.JS_LIB_DIR)
        .pipe(order(['jquery.min.js', 'jquery-ui.js', 'bootstrap.min.js']))
        .pipe(concat(routes.JS_LIB_MIN_OUT))
        .pipe(uglify())
        .pipe(gulp.dest(routes.JS_DEST));
    } else {
        gulp.src(routes.JS_LIB_DIR)
        .pipe(sourcemaps.init())
        .pipe(order(['jquery.min.js', 'jquery-ui.js', 'bootstrap.min.js']))
        .pipe(concat(routes.JS_LIB_OUT))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(routes.JS_DEST))
        .pipe(browserSync.reload({stream: true}));
    }
});

gulp.task('watch_lib', function() {
    gulp.watch(routes.JS_ALL, [ 'place_lib' ]);
});

gulp.task('place_html', function() {
    let clientLocation = (PRODUCTION) ? routes.JS_PUBLIC_SRC_MIN : routes.JS_SRC_OUT;
    let libLocation = (PRODUCTION) ? routes.JS_LIB_MIN_DEST : routes.JS_LIB_DEST;

    gulp.src(routes.HTML_SRC)
    .pipe(htmlreplace({
        'lib': libLocation,
        'client': clientLocation
    }))
    .pipe(gulp.dest(routes.HTML_DEST))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch_html', function() {
    gulp.watch(routes.HTML_SRC, [ 'place_html' ]);
});

gulp.task('place_files', function(){
    gulp.src(routes.FILES_DIR)
        .pipe(gulp.dest(routes.FILES_DEST));
});

gulp.task('place_etc', ['place_htaccess'], function(){
    gulp.src([routes.ETC_DIR, '!' + routes.HTACCESS])
    .pipe(gulp.dest(routes.ETC_DEST));
});

gulp.task('place_htaccess', function() {
    gulp.src(routes.HTACCESS)
    .pipe(rename('.htaccess'))
    .pipe(gulp.dest(routes.ETC_DEST));
});

gulp.task('resources:build', [ 'place_html', 'place_lib', 'place_css', 'place_fonts', 'place_images', 'place_files', 'place_etc' ]);
gulp.task('resources:watch', [ 'watch_html', 'watch_lib', 'watch_style', 'watch_images' ]);

gulp.task('default', ['client']);
gulp.task('client:build', [ 'client' ]);
gulp.task('client', [ 'production', 'resources:build', 'client:_build' ]);
gulp.task('client:dev', [ 'browsersync', 'resources:build', 'resources:watch', 'client:watch' ]);