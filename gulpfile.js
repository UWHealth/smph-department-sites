var gulp		 = require('gulp');
var utility 	 = require('gulp-util');
var autoprefixer = require('gulp-autoprefixer');
var browserSync  = require('browser-sync');
var chalk        = utility.colors;
var changed 	 = require('gulp-changed-in-place');
var flatten 	 = require('gulp-flatten');
var gIf 		 = require('gulp-if');
var include 	 = require('gulp-include');
var imgmin       = require('gulp-imagemin');
var kit 		 = require('gulp-kit');
var notify       = require('gulp-notify');
var plumber		 = require('gulp-plumber');
var prettify 	 = require('gulp-prettify');
var rename 		 = require('gulp-rename');
var sass		 = require('gulp-sass');
var size 		 = require('gulp-size');
var uglify 		 = require('gulp-uglify');


/******************************/
/******** Configuration *******/
/******************************/

//Set your browser support
//See autoprefixer's documentation for notation style:
// https://github.com/ai/browserslist#queries

var AUTOPREFIXER_BROWSERS = [
	'> 1%',
	'last 2 version',
	'ff >= 16',
    'ff 3.5',
	'android >= 2.3',
    'ie >= 8'
];

// Paths for watching and outputting
var PATHS = {
	scss: {
		watch:	['./_partials/**/*.scss'],
		main:	'./_partials/scss/*.scss',
		dest:  	'./style'
	},
	js: {
		watch:	['./_partials/js/**/*.js'],
		dest:  	'./javascript'
	},
	kits: {
		watch:	['./_partials/kits/**/*.kit'],
		dest:  	'./'
	},
	images: {
		watch: ['./_partials/images/**'],
		dest: './images'
	}
};

//Files to watch to keep browser preview up to date
var BROWSER_SYNC_WATCH = [
	'./style/*.css',
	'./javascript/**/*.js',
	'./*.html',
	'./images/**/*.{png|jpg|jpeg|gif|svg}'
];


/******************************/
/******** Gulp Tasks **********/
/******************************/


/**------ Main Tasks --------**/

/* Start local server and watch files for changes */
gulp.task('serve', ['default', 'browserSync']);

/** Compile and minify **/
gulp.task('prod', ['default']);
gulp.task('production', ['prod']);

/* Default Task */
// Gulp watching and processing without the local server
// This task is called by others, but can be called on its own by just using `gulp`
gulp.task('default', ['...', 'images', 'sass', 'js', 'kits', 'watch']);


/**-- Single-purpose Tasks --**/

/* File Watch */
//Watch file paths for changes (as defined in the PATHS variable)
gulp.task('watch', function(){
	gulp.watch(	PATHS.scss.watch,   ['sass']);
	gulp.watch(	PATHS.js.watch,     ['js']);
	gulp.watch(	PATHS.kits.watch,   ['kits']);
	gulp.watch(	PATHS.images.watch, ['images']);
});

/* Browser-sync */
//Spins up local http server
// and syncs actions across browsers
gulp.task('browserSync', function() {
	browserSync.init({
		files: BROWSER_SYNC_WATCH,
		port: 3000,
		ui: {
			port: 3030
		},
		server: {
			baseDir: ['./'],
			directory: false //true to provide folder navigation view
		},
		ghostMode: {
			clicks: true,
			location: true,
			forms: true,
			scroll: false
		},
		logPrefix: 'Browser ',
		scrollThrottle: 100,
		open: false //true if you want the browser to automatically open
	});
});

/* Sass Processing */
// Converts sass to CSS, minifies, and adds vendor prefixes where necessary
gulp.task('sass', function() {

	return gulp.src(PATHS.scss.main)
		.pipe(plumber({errorHandler: _error}))
		.pipe(sass({
			outputStyle: _sass_output,
			errLogToConsole: true,
			onError: function(err){
				console.log(chalk.red("[Sass] ")+err);
			}
		}))
		.pipe(autoprefixer({
			browsers: AUTOPREFIXER_BROWSERS
		}))
		.pipe(size({title: 'CSS', gzip: true, showFiles: true}))
		.pipe(gulp.dest(PATHS.scss.dest));
});

/* Javascript Processing */
//Javascript concatenating, uglifying, minifying, and renaming
gulp.task('js', function(){

	//Files beginning with an underscore shouldn't be processed on their own
	var _js_src = PATHS.js.watch.concat(['!./_partials/**/_*.js']);

	return gulp.src(_js_src)
		.pipe(plumber({errorHandler: _error}))
		.pipe(include())
		.pipe(gIf( _minify,
			uglify({preserveComments: 'some'})
		))
		//Check if files are changed only if minification is not required
		.pipe(gIf(! _minify, changed() ))
		.pipe(gIf( _minify,
			rename(function(path){
				// Add .min to uglified files
				// Make sure we don't duplicate .min
				path.basename = path.basename.replace('.min', '');
				path.basename = path.basename + '.min';
			})
		))
		.pipe(size({title: 'JS', showFiles: true, gzip: true}))
		.pipe(gulp.dest(PATHS.js.dest));
});

/* Kit Processing */
//Compile .kit files into html
gulp.task('kits', function(){

	//Files beginning with an underscore shouldn't be processed on their own
	var _kits_src = PATHS.kits.watch.concat(['!./_partials/**/_*.kit']);

	return gulp.src(_kits_src)
		.pipe(plumber({errorHandler: _error}))
		.pipe(kit())
		.pipe(prettify({
				indent_char: ' ',
				indent_size: _indent_size,
				indent_inner_html: false,
				end_with_newline: false,
				brace_style: "collapse"
			})
		)
		.pipe(flatten()) //Force files into root folder regardless of nesting
		.pipe(size({title: 'HTML', showFiles: true, gzip: true}))
		.pipe(gulp.dest(PATHS.kits.dest));
});

/* Image Optimization */
//Runs images through image-min and puts them into their destination folder
gulp.task('images', function(){

	return gulp.src(PATHS.images.watch)
		.pipe(plumber({errorHandler: _error}))
		.pipe(imgmin({
			progressive: true,
			svgoPlugins:[
				{ removeViewBox: false },
				{ removeUselessStrokeAndFill: false },
				{ removeEmptyAttrs: false },
				{ removeEmptyContainers: false },
				{ removeHiddenElemens: false },
				{ removeStyleElement: false },
				{ cleanupIDs: false },
				{ removeDimensions: false },
				{ removeRasterImages: false },
				{ removeUselessDefs: false }
			],
			multipass: true
		}))
		.pipe(changed())
		.pipe(gulp.dest(PATHS.images.dest));
});

/** Friendly message **/
gulp.task('...', function(){
	console.log(
		chalk.dim(' -------------------------------------') +
		chalk.magenta('\n  Gulp Started \n') +
		'  Ctrl + C to stop \n' +
		chalk.dim(' -------------------------------------')
	);
});

/******************************/
/******** Private *************/
/******************************/

/* Development variables */
// Changed via gulp tasks, shouldn't be changed by user
var
	_sass_output = 'expanded',
	_minify = false,
	_indent_size = 2;


/* Production variable switch */
// Tells gulp tasks to minify output correctly
if(utility.env._[0] === 'prod' || utility.env._[0] === 'production') {
	console.log('compressing all files');
	//Change sass output to compressed
    _sass_output = 'compressed';
    //Change html indent size to 1
    _indent_size = 1;
    //general minification indicator
    _minify = true;
}

/* Error handler */
// All errors get pushed here
function _error(err) {

	notify.onError({
		title:    "Error",
		subtitle: "<%= error.plugin %>",
		message:  "<%= error.message %>",
	})(err);

	this.emit('end');
}
