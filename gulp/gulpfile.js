
//////////////// Component require
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
var size = require('gulp-size');
var notify = require('gulp-notify');
var todo  = require ('gulp-todo');
var parker = require('gulp-parker');


//////////////// Gulp sass task
///// Compiler paths
var scssInput    = '../../app/Resources/sass/**/*.scss';
var cssOutput    = '../../web/static/public/css';
var imagePath    = '../../web/static/img/redesign/*"';
var imageOutput  = '../../web/static/img/redesign/testImg';
var todoOutput   = '../../app/logs';
var parkerInput  = '../../web/static/public/css/*.css';
var parkerOutput = '../../app/logs/cssMetrics.md';
var sourceMap    = '../../web/static/public/maps';

///// Plugin options
var sassOptions = {
  errLogToConsole: false,
  outputStyle: 'expanded'
};

var todoOptions = {
    'fileName': 'scssTodo.md'
};

var scssNotifyOptions = {
    onLast: true,
    title:   'SASS: <%= file.relative %>',
    message: '@ <%= options.date %>',
    templateOptions: { date: new Date() },
    //generate the compiled notification
    notify: function (options, callback) {
        console.log("Title:", options.title);
        console.log("File:", options.message);
        callback();
    }
};

var imageNotifyOptions = {
	onLast: true,
	title:   'Image: <%= file.relative %>',
	message: '@ <%= options.date %>',
	templateOptions: { date: new Date() },
	//generate the compiled notification
	notify: function (options, callback) {
		console.log("Title:", options.title);
		console.log("File:", options.message);
		callback();
	}
};

var parkerOptions = {
    file: parkerOutput,
    title: 'Metrics test report',
    metrics: [
        "TotalRules",
        "TotalStylesheets",
        "TotalStylesheetSize",
        "TotalImportantKeywords",
        "TotalSelectors",
        "TotalIdentifiers",
        "TotalDeclarations",
        "SelectorsPerRule",
        "IdentifiersPerSelector",
        "SpecificityPerSelector",
        "TopSelectorSpecificity",
        "TopSelectorSpecificitySelector",
        "TotalIdSelectors",
        "TotalUniqueColours",
        "UniqueColours"
    ]
};

///// Autoprefixer options
var autoprefixerOptions = {
  browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

///// Compiler task
gulp.task('sass', function () {

    return gulp
    // Find all `.scss` files from the `stylesheets/` folder
    .src(scssInput)
    // Run Sass on those files
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(size({
        'pretty': true
    }))
    // Write the resulting CSS in the output folder
    .pipe(gulp.dest(cssOutput))
    .pipe(notify(scssNotifyOptions));
});

///// Image minification task
gulp.task('imagemin', function () {
	return gulp

    .src(imagePath)
	.pipe(imagemin())
    .pipe(size({ 'pretty': true }))
	.pipe(gulp.dest(imageOutput))
    .pipe(notify(imageNotifyOptions));
});

///// TOdo file generator task
// generate a scssTodo.md from your scss files
gulp.task('todo', function() {
    gulp.src(scssInput)
        .pipe(todo(todoOptions))
        .pipe(gulp.dest(todoOutput));
    // -> Will output a TODO.md with your todos
});

gulp.task('parker', function() {
    return gulp.src(parkerInput)
        .pipe(parker(parkerOptions))
});


//////////////// Gulp watch task
gulp.task('watch', function() {
    var sassWatcher = gulp.watch(scssInput, ['sass']);

    // Watch the scssInput folder for change,
    // and run `sass` task when something happens
    sassWatcher.on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

//////////////// Dashboard General Tasks
gulp.task('dashboard-watch', ['watch']);
gulp.task('dashboard-todo',  ['todo']);
gulp.task('dashboard-scssMetrics', ['parker']);
