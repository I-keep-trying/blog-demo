'use strict'

// Load plugins
const autoprefixer = require('gulp-autoprefixer')
const browsersync = require('browser-sync').create()
const cleanCSS = require('gulp-clean-css')
const del = require('del')
const gulp = require('gulp')
const merge = require('merge-stream')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const uglify = require('gulp-uglify')
const exec = require('child_process').exec // run command-line programs from gulp
const execSync = require('child_process').execSync // command-line reports

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: './',
    },
    port: 3000,
    notify: false,
    browser: ['chrome', 'iexplore'],
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
    .src('./node_modules/bootstrap/scss/**/*')
    .pipe(gulp.dest('./vendor/bootstrap'))
  // Font Awesome
  var fontAwesome = gulp.src('./node_modules/@fortawesome/**/*').pipe(gulp.dest('./vendor'))
  // jQuery
  var jquery = gulp.src(['./node_modules/jquery/dist/*']).pipe(gulp.dest('./vendor/jquery'))
  return merge(bootstrap, fontAwesome, jquery)
}

// CSS task
function css() {
  return gulp
    .src('./scss/**/*.scss')
    .pipe(
      sass({
        sourcemaps: true,
        outputStyle: 'expanded',
        includePaths: './node_modules',
      })
    )
    .on('error', sass.logError)
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false,
      })
    )
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
    .src(['./js/*.js'])
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
  gulp.watch('./scss/**/*', css)
  gulp.watch('./js/**/*', js)
  gulp.watch('./**/*.html', browserSyncReload)
}

//git commit
const gitConfig = 'git add . && git commit -m "netlify deploy" && git push'

function git() {
  return gulp.pipe(exec(gitConfig))
}
const commit = gulp.series(git)
exports.commit = commit
exports.git = git

// Define complex tasks
const vendor = gulp.series(clean, modules)
const build = gulp.series(vendor, gulp.parallel(css, js))
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync))

// Export tasks
exports.css = css
exports.js = js
exports.clean = clean
exports.vendor = vendor
exports.build = build
exports.watch = watch
exports.default = build
