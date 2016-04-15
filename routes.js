module.exports = {
    /** Assets **/
    IMAGE_DIR: 'assets/images/**/*.*',
    FONTS_DIR: 'assets/fonts/**/*.*',
    FILES_DIR: 'assets/files/**/*.*',
    ETC_DIR:   'assets/etc/**/*.*',
    HTACCESS:  'assets/etc/htaccess.txt',
    ASSETS_ALL: ['assets/**/*.*', 'style/**/*.*'],

    IMAGE_DEST: 'public/images/',
    FONTS_DEST: 'public/fonts/',
    FILES_DEST: 'public/files/',
    ETC_DEST:   'public/',
    BUILD_DIR:  './public/',

    /** HTML **/
    HTML_SRC:  'html/**/*.html',
    HTML_DEST: 'public/',

    /** Javascript **/
    JS_ALL:       'javascript/**/**.js',
    JS_LIB_DIR:   'javascript/lib/**/*.js',
    JS_SRC_DIR:   'javascript/src/',
    JS_SRC_ENTRY: './javascript/src/index.js',
    JS_SRC_FILES: 'javascript/src/**/*.*',

    JS_VIRTUAL_DIR:    '/',
    JS_PUBLIC_SRC_MIN: 'javascript/build/client.min.js',

    JS_DEST:         'public/javascript/build/',
    JS_LIB_OUT:      'lib.js',
    JS_LIB_MIN_OUT:  'lib.min.js',
    JS_LIB_MIN_DEST: 'javascript/build/lib.min.js',
    JS_LIB_DEST:     'javascript/build/lib.js',
    JS_SRC_OUT:      'client.js',
    JS_SRC_MIN_OUT:  'client.min.js',

    /** Style **/
    SASS_DIR: 'style/src/**/*.scss',
    CSS_DIR:  'style/lib/**/*.css',

    CSS_DEST:    'public/stylesheets/',
    CSS_LIB_OUT: 'lib.css'
};
