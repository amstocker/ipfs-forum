var gulp = require('gulp');
var react = require('gulp-react');
var uglify = require('gulp-uglify');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var ipfs = require('ipfs-api')('localhost', 5001);


var MAIN_JSX = './src/jsx/main.jsx';
var SRC_JSX  = './src/jsx/**/*.jsx';
var DEST_JSX = './src/jsx_build';
var MAIN     = './src/jsx_build/main.js';
var DEST     = './public/js';
var NAME     = 'bundle.js';


function errorHandler (error) {
  console.log(error.toString());
}


gulp.task('jsx', function() {
  return gulp.src(SRC_JSX)
    .pipe(react())
      .on('error', errorHandler)
    .pipe(gulp.dest(DEST_JSX));
});

gulp.task('build', ['jsx'], function() {
  return gulp.src(MAIN)
    .pipe(browserify())
    .pipe(uglify())
    .pipe(rename(NAME))
    .pipe(gulp.dest(DEST));
  //return ipfs.add(['public'], {'recursive':true}, function(err, res) {
  //  if(err || !res) return console.error(err)
  //  res.forEach(function(file) {
  //      if (file.Name == 'public') {
  //        console.log('webapp multihash:', file.Hash);
  //      }
  //  })
  //});
});

//gulp.task('watch', function() {
//  gulp.watch(SRC_JSX, ['jsx', 'build']);
//});

gulp.task('default', ['build']);
