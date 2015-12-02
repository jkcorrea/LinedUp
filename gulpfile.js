var gulp = require('gulp');
var browserify = require('browserify');
var $ = require('gulp-load-plugins')();
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var paths = {
  sass: ['scss/**/*.scss'],
  js: ['www/js/**/*.js', '!www/js/lib/**/*.js', '!www/dist/**/*.js'],
  json: ['www/js/**/*.json', '!www/js/lib/**/*.json', '!www/dist/**/*.json'],
};

gulp.task('default', ['watch']);

/*
 * Watch for changes, update as needed
 */
gulp.task('watch', function() {
  gulp.start('linting-throw');
  gulp.start('browserify');

  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js.concat(paths.json), ['linting-throw', 'browserify']);
  // var _log = function (event) { console.log('File ' + event.path + ' was ' + event.type + ', running tasks...'); };
});

/*
 * ES Linting
 */
var eslint = function (fail) {
  return function () {
    return gulp.src(paths.js)
      .pipe($.eslint())
      .pipe($.eslint.format())
      .pipe($.if(fail, $.eslint.failOnError()));
  };
};

var jsonlint = function (fail) {
  var failReporter = function (file) { throw new Error(file.path + '\n' + file.jsonlint.message); };
  return function () {
    return gulp.src(paths.json)
      .pipe($.jsonlint())
      .pipe($.jsonlint.reporter(fail ? failReporter : undefined));
  };
};

gulp.task('eslint', eslint());
gulp.task('eslint-throw', eslint(true));
gulp.task('jsonlint', jsonlint());
gulp.task('jsonlint-throw', jsonlint(true));
gulp.task('linting', ['eslint', 'jsonlint']);
gulp.task('linting-throw', ['eslint-throw', 'jsonlint-throw']);

/*
 * Browserify - for bundling all require'd js files into one www/dist/bundle.js
 */
gulp.task('browserify', function() {
  return browserify('www/js/app.js', {debug: true})
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    // .pipe($.sourcemaps.init({loadMaps: true}))
      // .pipe($.uglify())
      .on('error', $.util.log)
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('www/dist'));
});

/*
 * SASS - Compile it down to css in www/css/
 */

gulp.task('sass', function(done) {
  gulp.src('./scss/app.scss')
    .pipe($.sass())
    .on('error', $.sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe($.minifyCss({
      keepSpecialComments: 0
    }))
    .pipe($.rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});
