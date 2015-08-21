var gulp = require('gulp'),
	minifyHTML = require('gulp-minify-html'),
	minifyCSS = require('gulp-minify-css'),
	uglify = require('gulp-uglify');

// Minifies our javaScript file and output it to build/js/*.html
gulp.task('minify-script',function() {
	gulp.src('src/js/app.js')
		.pipe(uglify())
		.pipe(gulp.dest('build/js/'));
});

gulp.task('minify-lib', function() {
	gulp.src('src/js/lib/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('build/js/lib/'));
})

gulp.task('minify-style', function(){
	gulp.src('src/css/style.css')
		.pipe(minifyCSS())
		.pipe(gulp.dest('build/css/'));
});

gulp.task('minify-html', function(){
	gulp.src('src/index.html')
		.pipe(minifyHTML())
		.pipe(gulp.dest('build/'));
});

gulp.task('watch',function() {
	gulp.watch('src/js/*.js',['minify-script']);
	gulp.watch('src/js/lib/*.js',['minify-lib']);
	gulp.watch('src/css/*.css',['minify-style']);
	gulp.watch('src/css/*.html',['minify-html']);
});

gulp.task('default',['minify-html','minify-style','minify-script','minify-lib','watch']);
