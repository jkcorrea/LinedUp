var gulp = require('gulp');
var browserify = require('browserify');
var $ = require('gulp-load-plugins')();
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var app = {
  styles: {
    path: 'app/styles/',
    src: '**/*.scss',
    main: 'app.scss',
    build: 'www/css/',
  },
  scripts: {
    path: 'app/scripts/',
    src: '**/*.(js|html)',
    build: 'www/js/',
    main: 'app.js'
  },
  fonts: {
    src: ['app/bower_components/ionic/fonts/**/*'],
    build: 'www/fonts/'
  },
  img: {
    src: ['app/bower_components/vis/dist/img/**/*'],
    build: 'www/img/'
  },
  html: {
    src: ['app/index.html'],
    build: 'www/'
  }
};



// Browserify - for bundling all require'd js files into one www/dist/bundle.js
  gulp.task('browserify', ['linting'], function() {
    return browserify(app.scripts.path + app.scripts.main, {debug: true})
      .bundle()
      .pipe(source(app.scripts.path + app.scripts.main))
      .pipe(buffer())
      // .pipe($.sourcemaps.init({loadMaps: true}))
        // .pipe($.uglify())
        .on('error', $.util.log)
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest(app.scripts.build));
  });

// Copy any additional assets
  gulp.task('fonts', function() {
    return gulp.src(app.fonts.src)
      .pipe($.changed(app.fonts.build))
      .pipe(gulp.dest(app.fonts.build));
  });

  gulp.task('img', function() {
    return gulp.src(app.img.src)
      .pipe($.changed(app.img.build))
      .pipe(gulp.dest(app.img.build));
  });

  gulp.task('html', function() {
    return gulp.src(app.html.src)
      .pipe($.changed(app.html.build))
      .pipe(gulp.dest(app.html.build));
  });

// SASS - Compile it down to css in www/css/
  gulp.task('sass', function(done) {
    gulp.src(app.styles.path + app.styles.main)
      .pipe($.sass())
      .on('error', $.sass.logError)
      // .pipe($.minifyCss({ keepSpecialComments: 0 }))
      // .pipe($.rename({ extname: '.min.css' }))
      .pipe(gulp.dest(app.styles.build))
  });

// ES Linting
  gulp.task('linting', function() {
    return gulp.src(app.scripts.path)
      .pipe($.eslint())
      .pipe($.eslint.format())
      .pipe($.eslint.failOnError());
  });


gulp.task('watch', function() {
  gulp.watch(app.fonts.src, ['fonts']);
  gulp.watch(app.img.src, ['img']);
  gulp.watch(app.html.src, ['html']);
  gulp.watch(app.styles.path + app.styles.src, ['sass']);
  gulp.watch(app.scripts.path + app.scripts.src, ['browserify']);
});
gulp.task('build', ['browserify', 'sass', 'html', 'fonts', 'img']);
gulp.task('default', ['build', 'watch']);
