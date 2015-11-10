var gulp		 = require('gulp');
var utility 	 = require('gulp-util');

var autoprefixer = require('gulp-autoprefixer');
var browserSync  = require('browser-sync');
var chalk		 = utility.colors;
var flatten 	 = require('gulp-flatten');
var gFilter		 = require('gulp-filter');
var gIf 		 = require('gulp-if');
var include 	 = require('gulp-include');
var kit 		 = require('gulp-kit');
var notify       = require('gulp-notify');
var plumber		 = require('gulp-plumber');
var rename 		 = require('gulp-rename');
var sass		 = require('gulp-sass');
var size 		 = require('gulp-size');
var uglify 		 = require('gulp-uglify');

//Set your browser support
//See autoprefixer's documentation for notation style:
// https://github.com/ai/browserslist#queries

var autoprefixer_browsers = [
	'> 1%',
	'last 2 version',
	'ff 3.5',
	'ff >= 16',
	'ie >= 8',
	'android >= 2.3'
];

// Paths for watching and outputting
var paths = {
	scss: {
		watch:	'./_partials/**/*.scss',
		main:	'./_partials/scss/*.scss',
		dest:  	'./style'
	},
	js: {
		watch:	'./_partials/**/*.js',
		dest:  	'./javascript'
	},
	kits: {
		watch:	'./_partials/**/*.kit',
		dest:  	'./'
	}
};

//Files to watch to keep browser preview up to date
var browser_sync_watch = ['./style/*.css', './javascript/**', './*.html'];

//Development variables
var
	sass_output = 'nested',
	minify = true,
	lint = true;

//Watch file paths for changes (as defined in the paths variable)
gulp.task('watch', function(){
	gulp.watch(paths.scss.watch, ['sass']);
	gulp.watch(paths.js.watch, ['js']);
	gulp.watch(paths.kits.watch, ['kits']);
});

//Browser-sync
//Spins up local http server
// and syncs actions across browsers
gulp.task('browserSync', function() {
    browserSync.init({
		files: browser_sync_watch,
		port: 3000,
		ui:{
			port: 3030
		},
		server: {
            baseDir: ['./'],
			directory: false
        },
		ghostMode: {
			clicks: true,
			location: true,
			forms: true,
			scroll: false
		},
		logPrefix: 'Browser',
		scrollThrottle: 100,
		open: false
	});
});

//Sass with Source maps
gulp.task('sass', function() {

	return gulp.src(paths.scss.main)
		.pipe(plumber({errorHandler: _error}))
		.pipe(sass({
			outputStyle: sass_output,
			errLogToConsole: true,
			onError: function(err){
				console.log(chalk.red("[Sass] ")+err);
			}
		}))
		.pipe(autoprefixer({
			browsers: autoprefixer_browsers
		}))
		.pipe(size({title: 'CSS', gzip: true, showFiles: true}))
		.pipe(gulp.dest(paths.scss.dest));
});

//Javascript concatenating and renaming
gulp.task('js', function(){

	return gulp.src(paths.js.watch)
		.pipe(plumber({errorHandler: _error}))
		.pipe(include())
		.pipe(gIf(minify, uglify({preserveComments: 'some'})))
		.pipe(rename(function(path){
			//remove underscores from the beginning of partials
			path.basename = path.basename.replace(/^_/gi,"");
		}))
		.pipe(size({title: 'JS', showFiles: true, gzip: true}))
		.pipe(gulp.dest(paths.js.dest));
});

//Compile .kit files into html
gulp.task('kits', function(){

	return gulp.src([paths.kits.watch, '!./_partials/**/*_*.kit'])
		.pipe(plumber({errorHandler: _error}))
		.pipe(kit())
		.pipe(flatten()) //Force files into root folder regardless of nesting
		.pipe(size({title: 'HTML', showFiles: true, gzip: true}))
		.pipe(gulp.dest(paths.kits.dest));
});

//Default gulp task
gulp.task('default', ['...', 'sass', 'js', 'kits', 'watch']);

//Friendly message task
gulp.task('...', function(){
	console.log(
		chalk.dim(' -------------------------------------') +
		chalk.magenta('\n  Gulp Started \n') +
		'  Ctrl + C to stop \n' +
		chalk.dim(' -------------------------------------')
	);
});

//Start local server and watch files for changes
gulp.task('serve', ['default', 'browserSync']);

//Compile and minify
gulp.task('prod', ['switchVars', 'sass', 'js', 'kits']);

//Production variable switch
gulp.task('switchVars', function(){
	sass_output = 'compressed';
	minify = true;
});

//Private function
//Extracts filenames from a path
function _filename(path) {
	return path.substr(path.lastIndexOf('/') + 1);
}

//Error handler
function _error(err) {

	notify.onError({
		title:    "Error",
		subtitle: "<%= error.plugin %>",
		message:  "<%= error.message %>",
	})(err);

	this.emit('end');
}
