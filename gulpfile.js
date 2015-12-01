var gulp = require('gulp'),
    path = require('path'),

    // CSS
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minify = require('gulp-minify-css'),

    // JS BUILD
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),

    // DEPLOY
    sftp = require("gulp-sftp"),

    // Import files
    pkg = require('./package.json')
;


// SASS
gulp.task('sass', function() {
  gulp.src('_sass/style.scss')
    .pipe(sass({style: 'compressed'}))
    .pipe(autoprefixer())
    .pipe(minify())
    .pipe(gulp.dest('css/'))
});

// JS
gulp.task('js', function () {
  gulp.src(['_js/app.js'])
    .pipe(uglify())
    .pipe(rename('build.js'))
    .pipe(gulp.dest('js/'))
});

// Jekyll Task
gulp.task('jekyll', function (gulpCallBack){
  var spawn = require('child_process').spawn;
  var jekyll = spawn('jekyll', ['build'], {stdio: 'inherit'});

  jekyll.on('exit', function(code) {
    gulpCallBack(code === 0 ? null : 'ERROR: Jekyll process exited with code: '+code);
  });
});

// Jekyll Serve Task
gulp.task('serve', function (gulpCallBack){
  var spawn = require('child_process').spawn;
  var jekyll = spawn('jekyll', ['serve'], {stdio: 'inherit'});

  jekyll.on('exit', function(code) {
    gulpCallBack(code === 0 ? null : 'ERROR: Jekyll process exited with code: '+code);
  });
});

// Deploy task
gulp.task('deploy', function(){
  gulp.src(['_site/**', '_site/**/**', '!_site/node_modules/**', '!_site/jekyll/**', '!_site/gulpfile.js'])
    .pipe(sftp({
      host: "159.203.76.23",
      user: "root",
      remotePath: "/var/www/musebridal.co.uk/public_html/",
      key: {location: "~/.ssh/id_rsa", passphrase: "Joe09051989"}
    }));
});

// Default task
gulp.task('default', ['sass', 'js', 'jekyll'], function (event) {
  gulp.watch("_sass/**", ['sass', 'jekyll']);
  gulp.watch(['*.html', '*/*.html', '*/*.md'], ['jekyll']);
  gulp.watch("js/*.js", ['js', 'jekyll']);
});

// Local build task
gulp.task('local', ['sass', 'js', 'jekyll'], function (event) {
  gulp.watch("_sass/**", ['sass', 'jekyll']);
  gulp.watch("*.html", ['jekyll']);
  gulp.watch("js/*.js", ['js', 'jekyll']);
});
