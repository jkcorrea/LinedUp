var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var del = require('del');
var $ = require('gulp-load-plugins')();
var _ = require('lodash');

var paths = {
  build: './www',
  styles: {
    path: './app/styles/',
    main: './app/styles/app.scss',
    src: ['./app/styles/**/*.scss'],
    build: './www/css/',
  },
  scripts: {
    path: '/app/scripts/',
    main: './app/scripts/app.js',
    src: ['./app/scripts/**/*.js'],
    build: './www/js/'
  },
  fonts: {
    src: ['./app/bower_components/ionic/fonts/**/*'],
    build: './www/fonts/'
  },
  img: {
    src: ['./app/bower_components/vis/dist/img/**/*', './app/img/**/*'],
    build: './www/img/'
  },
  html: {
    src: ['./app/**/*.html', '!./app/scripts/**/*.html'],
    build: './www/',
  },
  templates: {
    src: ['./app/scripts/**/*.html'],
    build: './www/js/'
  }
};


// Browserify - for bundling all require'd js files into one www/dist/bundle.js
  var customOpts = { entries: [paths.scripts.main], debug: true };
  var opts = _.assign({}, watchify.args, customOpts);
  var b = watchify(browserify(opts));

  gulp.task('browserify', ['linting'], function() {
    return b.bundle()
      .on('error', $.util.log.bind($.util, 'Browserify Error'))
      .pipe(source(paths.scripts.main))
      .pipe(buffer())
      .pipe($.sourcemaps.init({loadMaps: true}))
        // .pipe($.uglify())
        .on('error', $.util.log)
      .pipe($.sourcemaps.write('./'))
      .pipe($.rename({ dirname: './' }))
      .pipe(gulp.dest(paths.scripts.build));
  });

// SASS - Compile it down to css in www/css/
  gulp.task('sass', function() {
    gulp.src(paths.styles.main)
      .pipe($.sass())
      .on('error', $.sass.logError)
      // .pipe($.minifyCss({ keepSpecialComments: 0 }))
      // .pipe($.rename({ extname: '.min.css' }))
      .pipe(gulp.dest(paths.styles.build))
  });

// Copy any additional assets
  gulp.task('fonts', function() {
    return gulp.src(paths.fonts.src)
      .pipe($.changed(paths.fonts.build))
      .pipe(gulp.dest(paths.fonts.build));
  });

  gulp.task('img', function() {
    return gulp.src(paths.img.src)
      .pipe($.changed(paths.img.build))
      .pipe(gulp.dest(paths.img.build));
  });

  gulp.task('html', function() {
    return gulp.src(paths.html.src)
      .pipe($.changed(paths.html.build))
      .pipe(gulp.dest(paths.html.build));
  });

  gulp.task('templates', function() {
    return gulp.src(paths.templates.src)
      .pipe($.changed(paths.templates.build))
      .pipe(gulp.dest(paths.templates.build));
  });

  gulp.task('copy', ['fonts', 'html', 'templates', 'img']);

// ES Linting
  gulp.task('linting', function() {
    return gulp.src(paths.scripts.src)
      .pipe($.eslint())
      .pipe($.eslint.format())
      .pipe($.eslint.failOnError());
  });

gulp.task('clean', function(done) {
  del([paths.build], done);
});

gulp.task('build', ['browserify', 'sass', 'copy']);
gulp.task('default', ['build'], function() {
  gulp.watch(paths.fonts.src, ['fonts']);
  gulp.watch(paths.img.src, ['img']);
  gulp.watch(paths.html.src, ['html']);
  gulp.watch(paths.templates.src, ['templates']);
  gulp.watch(paths.styles.src, ['sass']);
  gulp.watch(paths.scripts.src.concat(paths.html.src), ['browserify']);
});
