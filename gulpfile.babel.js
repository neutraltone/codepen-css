/**
 * Gulp Packages
 * =============
 * Import our gulp packages.
 */

import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';
import header from 'gulp-header';
import imagemin from 'gulp-imagemin';
import plumber from 'gulp-plumber';
import pngquant from 'imagemin-pngquant';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';


/**
 * Constants
 * ---------
 * Constants used throughout this boilerplate.
 */

import pkg from './package.json';
import options from './gulp-options.json';


/**
 * Banner Template
 * ---------------
 * Define our banner template which is injected into
 * the top of our minfied Stylesheet and JavaScript.
 */

const banner = [
  `/*!
    * ${pkg.name}
    * ${pkg.repository.url}
    * @author ${pkg.author}
    * @version ${pkg.version}
    * Copyright ${new Date().getFullYear()}. ${pkg.license} licensed.
    */`,
  '\n'
].join('');


/**
 * BrowserSync.io
 * --------------
 * - Runs css tasks
 * - Serve project on: localhost:3000
 * - Watch css files for changes
 */

gulp.task('serve', [
    'sass',
    'images'
  ], () => {
    browserSync.init({
      server: options.dest.dist
    });
    gulp.watch(options.src.scss, ['sass']);
    gulp.watch(options.src.img, ['images']);
    gulp.watch(`${options.dest.dist}/*.html`).on('change', browserSync.reload);
});


/**
 * Sass
 * -------
 * - Assign plugins to processors variable
 * - Create sourcemaps
 * - Process css with PostCSS
 * - Inject banner into finished file
 * - Add .min suffix
 * - Copy to destination
 */

gulp.task('sass', () => {
  return gulp.src(options.src.scss)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: [
        options.dep.normalize
      ],
      outputStyle: 'compressed',
      errLogToConsole: true
    }))
    .pipe(autoprefixer({
			browsers: options.support.browser,
			cascade: false
		}))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(options.dest.css))
    .pipe(browserSync.reload({
      stream: true,
      once: true
    }))
});


/**
 * Image Optimisation
 * ------------------
 * - Compress images
 * - Copy to destination
 * - Reload BrowserSync
 */

gulp.task('images', () => {
  return gulp.src(options.src.img)
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{
          removeViewBox: false
        }],
        use: [pngquant()]
    }))
    .pipe(gulp.dest(options.dest.img))
    .pipe(browserSync.stream())
});


// Default Task
gulp.task('default', ['serve']);

// Build Task
gulp.task('build', ['sass', 'images']);
