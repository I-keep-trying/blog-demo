'use strict'

// Load plugins
const browsersync = require('browser-sync').create()
const cleanCSS = require('gulp-clean-css')
const del = require('del')
const gulp = require('gulp')
const autoprefixer = require('autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const cssnano = require('cssnano')
const postcss = require('gulp-postcss')
const merge = require('merge-stream')
const plumber = require('gulp-plumber')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const uglify = require('gulp-uglify')
const { src, dest } = require('gulp')

// File paths
const files = {
  scssPath: '/scss/**/*.scss',
  jsPath: '/js/**/*.js',
}

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: './',
    },
    port: 3000,
    notify: false,
    browser: ['chrome'],
  })
  done()
}

// BrowserSync reload
function browserSyncReload(done) {
  browsersync.reload()
  done()
}

// Clean vendor
function clean() {
  return del(['./vendor/'])
}

// Bring third party dependencies from node_modules into vendor directory
function modules() {
  // Bootstrap
  var bootstrap = gulp
    .src('./node_modules/bootstrap/dist/**/*')
    .pipe(gulp.dest('./vendor/bootstrap'))
  // Font Awesome
  var fontAwesome = gulp.src('./node_modules/@fortawesome/**/*').pipe(gulp.dest('./vendor'))
  // jQuery
  var jquery = gulp.src(['./node_modules/jquery/dist/*']).pipe(gulp.dest('./vendor/jquery'))
  return merge(bootstrap, fontAwesome, jquery)
}

// CSS task
// SCSS Sourcemapping
function scssTask() {
  return src(files.scssPath)
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: 'expanded',
        includePaths: './node_modules',
      })
    )
    .on('error', sass.logError)
    .pipe(
      postcss([
        autoprefixer({
          cascade: false,
        }),
        cssnano(),
      ])
    )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./css'))
    .pipe(
      rename({
        suffix: '.min',
      })
    )
    .pipe(cleanCSS())
    .pipe(gulp.dest('./css'))
    .pipe(browsersync.stream())
}

// JS task
function js() {
  return gulp
    .src(['./js/*.js', '!./js/*.min.js', '!./js/contact_me.js', '!./js/jqBootstrapValidation.js'])
    .pipe(uglify())
    .pipe(
      rename({
        suffix: '.min',
      })
    )
    .pipe(gulp.dest('./js'))
    .pipe(browsersync.stream())
}

// Watch files
function watchFiles() {
  gulp.watch('./scss/**/*', scssTask)
  gulp.watch('./js/**/*', js)
  gulp.watch('./*.html', browserSyncReload)
}

// Define complex tasks
const vendor = gulp.series(clean, modules)
const build = gulp.series(vendor, gulp.parallel(scssTask, js))
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync))

// Export tasks
exports.scssTask = scssTask
exports.js = js
exports.clean = clean
exports.vendor = vendor
exports.build = build
exports.watch = watch
exports.default = build
