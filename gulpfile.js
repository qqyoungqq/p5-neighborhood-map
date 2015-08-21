var gulp = require('gulp'),
	minifyHTML = require('gulp-minify-html'),
	minifyCSS = require('gulp-minify-css'),
	uglify = require('gulp-uglify');

gulp.task('minify-script',function() {
	gulp.src('src/js/app.js')
		.pipe(uglify())
		.pipe(gulp.dest('../master/js/'));
});

gulp.task('minify-lib', function() {
	gulp.src('src/js/lib/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('../master/js/lib/'));
})

gulp.task('minify-style', function(){
	gulp.src('src/css/style.css')
		.pipe(minifyCSS())
		.pipe(gulp.dest('../master/css/'));
});

gulp.task('minify-html', function(){
	gulp.src('src/index.html')
		.pipe(minifyHTML())
		.pipe(gulp.dest('../master/'));
});

gulp.task('copy', function() {
    gulp.src(['../master/js/*'])
        .pipe(gulp.dest('../gh-pages/js/'));
    gulp.src(['../master/js/lib/*'])
        .pipe(gulp.dest('../gh-pages/js/lib/'));        
    gulp.src(['../master/css/*'])
        .pipe(gulp.dest('../gh-pages/css/'));
    gulp.src('../master/*.html')
        .pipe(gulp.dest('../gh-pages/'));
    gulp.src('../master/README.md')
        .pipe(gulp.dest('../gh-pages/'));
});

gulp.task('watch',function() {
	gulp.watch('src/js/*.js',['minify-script']);
	gulp.watch('src/js/lib/*.js',['minify-lib']);
	gulp.watch('src/css/*.css',['minify-style']);
	gulp.watch('src/css/*.html',['minify-html']);
	gulp.watch('../master/*',['copy']);
});

gulp.task('default',['minify-html','minify-style','minify-script','minify-lib','copy','watch']);
