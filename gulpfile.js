const { src, dest, task, series, watch, parallel } = require("gulp");

const rm = require('gulp-rm');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const px2rem = require('gulp-smile-px2rem');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');
const gulpif = require('gulp-if');
const env = process.env.NODE_ENV;

const styles = [
    
    'src/css/style.scss'
];

// const libs = [
//     'src/scripts/*.js'
// ];

const scripts = [
    'src/scripts/*.js',
    'src/scripts/**/**/*.js'
];

task('clean', () => {
    return src('${DIST_PATH}/**/*', { read: false })
        .pipe(rm())
})


task('copy:html', () => {
    return src('src/*.html')
        .pipe(dest('dist'))
        .pipe(reload({ stream: true }));
})

task('copy:img', () => {
    return src('src/img/**/*.*')
        .pipe(dest('dist/img'))
        .pipe(reload({ stream: true }));
})

task('copy:fonts', () => {
    return src('src/fonts/*.*')
        .pipe(dest('dist/fonts'))
        .pipe(reload({ stream: true }));
})


task('styles', () => {
    return src(styles)
        .pipe(gulpif(env === 'dev', sourcemaps.init()))
        .pipe(concat('style.scss'))
        .pipe(sassGlob())
        .pipe(sass().on('error', sass.logError))
        // .pipe(px2rem())
        .pipe(gulpif(env === 'prod', autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        })))
        .pipe(gulpif(env === 'prod', gcmq()))
        .pipe(gulpif(env === 'prod', cleanCSS()))
        .pipe(gulpif(env === 'dev', sourcemaps.write()))
        .pipe(dest('dist'))
        .pipe(reload({ stream: true }));
});

task('server', () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});

task('scripts', () => {
    return src(scripts)
        .pipe(gulpif(env === 'dev', sourcemaps.init()))
        .pipe(concat('main.js', { newLine: ';' }))
        .pipe(gulpif(env === 'prod', babel({
            presets: ['@babel/env']
        })))
        .pipe(gulpif(env === 'prod', uglify()))
        .pipe(gulpif(env === 'dev', sourcemaps.write()))
        .pipe(dest('dist'))
        .pipe(reload({ stream: true }));
});

task('watch', () => {
    watch('./src/css/**/*.scss', series('styles'));
    watch('./src/*.html', series('copy:html'));
    watch('./src/scripts/*.js', series('scripts'));

});



task('default',
    series('clean',
        parallel('copy:html', 'styles', 'scripts', 'copy:fonts', 'copy:img'),
        parallel('watch', 'server')
    )
);

task('build',
    series('clean',
        parallel('copy:html', 'styles', 'scripts', 'copy:fonts', 'copy:img'),
        parallel('watch', 'server')
    )
);

const gulp = require('gulp');
const ghPages = require('gulp-gh-pages');
 
gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});