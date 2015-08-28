var gulp = require('gulp');
var react = require('gulp-react');
var uglify = require('gulp-uglify');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');


var MAIN = './public/jsx/main.jsx';
var DEST = './public/js';
var NAME = 'bundle.js';


gulp.task('build', function() {
  return gulp.src(MAIN)
    .pipe(browserify())
    .pipe(react())
    .pipe(uglify())
    .pipe(rename(NAME))
    .pipe(gulp.dest(DEST));
});

gulp.task('watch', function() {
  gulp.watch(MAIN, ['build']);
});

gulp.task('default', ['watch', 'build']);
