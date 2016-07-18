const gulp = require('gulp');
const watch = require('gulp-watch');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const babel = require('gulp-babel');

var minifyCss = require('gulp-minify-css');
var sass = require('gulp-sass');
var compass = require('gulp-compass');

const DIST_PATH = '../public';

gulp.task('build-js',function () {
    gulp.src('./js/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('app.js'))
        .on('error', swallowError)
        .pipe(gulp.dest(`${DIST_PATH}/js`))
        .pipe(uglify())
        .on('error', swallowError)
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest(`${DIST_PATH}/js`))
});

gulp.task('compile-sass', function() {
    return gulp.src('./sass/style.scss')
        .pipe(compass({
            config_file: './config.rb'
        }))
        .on('error', swallowError)
        .pipe(gulp.dest('./css'));
});


gulp.task('build-css',['compile-sass'],function () {
    gulp.src('./css/**/*.css')
        .pipe(gulp.dest(`${DIST_PATH}/css`))
        .pipe(minifyCss())
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest(`${DIST_PATH}/css`))
});

function swallowError (error) {
    console.log(error.toString());
    this.emit('end');
}

gulp.task('watch', ['build-js', 'build-css'], function() {
    gulp.watch('./js/**/*.js', ['build-js']);
    gulp.watch('./sass/**/*.scss', ['build-css']);
});