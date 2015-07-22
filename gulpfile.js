var gulp = require('gulp'),
	minifyHtml = require('gulp-minify-html'),
	minifyCss = require('gulp-minify-css'),
	uglify = require('gulp-uglify');

// Minifies our HTML file and output it to build/*.html
gulp.task('content',function() {
	gulp.src('src/index.html')
		.pipe(minifyhtml())
		.pipe(gulp.dest('build/'));
});