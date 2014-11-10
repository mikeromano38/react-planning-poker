var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('default', function() {
	// place code for your default task here
});

gulp.task('watchBrowserify', function(){
	var watcher = gulp.watch('./public/javascripts/**/*.js', ['browserify']);

	watcher.on('change', function( evt ) {
		console.log('File ' + evt.path + ' was ' + evt.type + ' browserifying...');
	});
});

gulp.task('browserify', function(){
	browserify( './public/javascripts/app.js')
		.bundle()
		.pipe(source('app-bundled.js'))
		.pipe(gulp.dest('./public/javascripts/'));
});