var gulp = require('gulp');
var connect = require('gulp-connect');
var $ = require('gulp-load-plugins')({ lazy: true });
var config = require('./gulp.config')();

gulp.task('connect', function() {
    connect.server();
});

gulp.task('styles', function() {
    return gulp
        .src(config.less)
        .pipe($.plumber()) // exit gracefully if something fails after this
        .pipe($.less())
        .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
        .pipe(gulp.dest(config.build));
});

gulp.task('default', ['connect']);