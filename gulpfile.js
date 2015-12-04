var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    compass = require('gulp-compass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    gulpNgConfig = require('gulp-ng-config'),
    print = require('gulp-print'),
    del = require('del'),

    input = {
        'html':         'source/*.html',
        'sass':         'source/sass/**/*.scss',
        'javascript':   'source/javascript/**/*.js',
        'vendor_css':   [
                            'bower_components/ng-materialize/dist/ng-materialize.min.css',
                            'bower_components/waves/dist/waves.min.css',
                            'bower_components/angular-hotkeys/build/hotkeys.min.css'                         
                        ],
        'vendor_js':    [
                            'bower_components/angular/angular.js',
                            'bower_components/angular-route/angular-route.js',
                            'bower_components/ngDropbox/dropbox.js',
                            'bower_components/ng-materialize/dist/ng-materialize.js',
                            'bower_components/angular-animate/angular-animate.js',
                            'bower_components/waves/dist/waves.js',
                            'bower_components/angular-hotkeys/build/hotkeys.js'
                        ],
        'config': 'noopad.config'
    },

    output = {
        'dist': 'dist',
        'html': 'dist',
        'stylesheets': 'dist/css',
        'javascript': 'dist/js'
    };

gulp.task('jshint', function () {
    return gulp.src(input.javascript)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build-js', function () {
    // if (!exist /source/javascript/config.js) {
    //     configure();   
    // }
    return gulp.src(input.javascript)
        .pipe(print())
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        //.pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(output.javascript));
});

gulp.task('build-vendor-js', function () {
    return gulp.src(input.vendor_js)
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
      //  .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(output.javascript));
});

gulp.task('build-css', function () {
    return gulp.src(input.sass)
        .pipe(sourcemaps.init())
        .pipe(compass({
            css: 'dist/css',
            sass: 'source/sass'
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(output.stylesheets));
});

gulp.task('build-vendor-css', function () {
    return gulp.src(input.vendor_css)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(output.stylesheets));
});

gulp.task('copy-html', function () {
    return gulp.src(input.html)
        .pipe(gulp.dest(output.html));
});

gulp.task('watch', function () {
    gulp.watch(input.javascript, ['jshint', 'build-js']);
    gulp.watch(input.sass, ['build-css']);
    gulp.watch(input.html, ['copy-html']);
});

function configure() {
    //var env = (gutil.env.type === 'production' ? 'production' : 'localhost');
    console.log('YIR! were going to ' + gutil.env.type);
    gulp.src('./config.json')
        .pipe(gulpNgConfig(input.config, {
            environment: gutil.env.type
        }))
        .pipe(gulp.dest('source/javascript'));
}

// This generates source/javascript/config.js
gulp.task('configure', configure);

function clean() {
    del([output.dist, 'source/javascript/config.js']);
}

gulp.task('clean', clean);

gulp.task('default', ['jshint', 'build-js', 'build-vendor-js', 'build-css', 'build-vendor-css', 'copy-html', 'watch']);

gulp.task('dist', ['build-js', 'build-vendor-js', 'build-css', 'build-vendor-css', 'copy-html']);
