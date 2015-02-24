var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var reactify = require('reactify');
var uglify = require('gulp-uglify');
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');

gulp.task('sass', function () {
	gulp.src('./public/stylesheets/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: require('node-bourbon').includePaths
		}))
		.pipe(sourcemaps.write())
		.pipe(concat('style.css'))
		.pipe(gulp.dest('./public/stylesheets/'));
});

gulp.task('watchSass', function(){
	var watcher = gulp.watch(['./public/stylesheets/**/*.scss'], ['sass']);

	watcher.on('change', function( evt ) {
		console.log('File ' + evt.path + ' was ' + evt.type + ' compiling sass...');
	});
});

gulp.task('default', function() {
	// place code for your default task here
});

gulp.task('watchBrowserify', function(){
	var watcher = gulp.watch(['./public/javascripts/**/*.js*', '!./public/javascripts/app-bundled.map.json', '!./public/javascripts/app-bundled.js'], ['browserify']);

	watcher.on('change', function( evt ) {
		console.log('File ' + evt.path + ' was ' + evt.type + ' browserifying...');
	});
});

gulp.task('browserify', function(){
	browserify({
		entries: './public/javascripts/app.jsx',
		transform: [reactify],
		debug: true
	})
	.bundle()
	.pipe(source('app-bundled.js'))
	//.pipe(uglify())
	.pipe(gulp.dest('./public/javascripts/'));
});