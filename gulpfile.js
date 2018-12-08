var gulp = require('gulp');
var pkg = require('./package.json');

var imagemin = require('gulp-imagemin');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var header = require('gulp-header');
var webserver = require('gulp-webserver');

gulp.task('html', function() {
	gulp.src('./src/index.html')
			.pipe(gulp.dest('./dist'));
});

gulp.task('img', function() {
	gulp.src('./src/img/*.jpg')
			.pipe(imagemin())
			.pipe(gulp.dest('./dist/img'));
});

gulp.task('sass', function() {
	gulp.src('./src/scss/*.scss')
			.pipe(plumber())
			.pipe(sass({outputStyle: 'expanded'}))
			.pipe(autoprefixer({
				browsers: ['last 2 version', 'iOS >= 8.1', 'Android >= 4.4'],
				cascade: false
			}))
			.pipe(gulp.dest('./dist/css'));
});

gulp.task('js', function() {
	gulp.src('./src/coffee/*.coffee')
			.pipe(plumber())
			.pipe(coffee())
			.pipe(concat('all.min.js'))
			.pipe(uglify())
			// .pipe(header('/* copyright @taguchi */'))
			// .pipe(header('/* copyright <%= name %> */', {name: 'taguchi'}))
			.pipe(header('/* copyright <%= pkg.name %> */', {pkg: pkg}))
			.pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', function() {
	gulp.watch('./src/coffee/*.coffee', ['js'])
	gulp.watch('./src/*.html', ['html'])
	gulp.watch('./src/scss/*.scss', ['sass'])
});

gulp.task('webserver', function() {
	gulp.src('./dist')
		.pipe(
			webserver({
				host: '192.168.33.10',
				livereload: true
			}))
});

gulp.task('default', ['html', 'img', 'js', 'sass', 'watch', 'webserver']);
