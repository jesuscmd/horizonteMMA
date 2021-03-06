
var gulp = require('gulp'), 
paths =  require('./gulp.config.json'),
gulpLoadPlugins = require('gulp-load-plugins'),
$ = gulpLoadPlugins();
$.browserSync = require('browser-sync');
$.reload = require('browser-sync').reload;
$.useref = require('gulp-useref');
$.concat = require('gulp-concat');
$.cssnano = require('gulp-cssnano');
$.uglify = require('gulp-uglify');
$.del = require('del');
$.gulpIf = require('gulp-if');
$.runSequence = require('run-sequence');
$.imagemin = require('gulp-imagemin');
$.browserSync = require('browser-sync');
$.compass = require('gulp-compass');



/**
 * Observa cambios en archivos html, js y scss
 */

gulp.task('watchApp', function(){
  // // Reload to Web App
  // gulp.watch(paths.app+'/**/*.scss',['sass']).on('change',$.reload);
  gulp.watch(paths.app+'/**/*.js').on('change',$.reload);
});


/**
 * Tarea que genera compilación de css con Compass
 */

gulp.task('compass', function() {
  return gulp.src(paths.app + 'scss/*.scss')
  .pipe($.compass({
    sass: paths.app + 'scss/',
    css: paths.app + 'css/',
    style : 'expanded',
    comments : 'true',
    debug: 'true'
  }))
  .pipe($.notify({message: 'Estilos completos'}));
});

/**
 * Tarea que genera la compilación de scss y crea el archivo para distribucion 
 */

// gulp.task('scssDist', function() {
//   gulp.src(paths.app +  'scss/main.{scss,sass}')
//   .pipe($.sourcemaps.init())
//   .pipe($.sass({
//     errLogToConsole: true
//   }))
//   .pipe($.sourcemaps.write())
//   .pipe($.cssmin())
//   .pipe($.rename({suffix: '.min'}))
//   .pipe(gulp.dest(paths.cssDist));
// });


gulp.task('scssDist', function() {
  return gulp.src(paths.app + 'scss/main.scss')
  .pipe($.compass({
    sass: paths.app + 'scss/',
    css: paths.cssDist + 'css/',
    style : 'expanded',
    comments : 'false',
    debug: 'false'
  }))
});


/**
 * Tarea que une todos los archivos js y los comprime para distribucion 
 */

gulp.task('jsDist', function() {
    gulp.src(paths.jsDist)
    .pipe($.concat('main.js'))
    .pipe($.rename({suffix: '.min'}))
    .pipe($.uglify({compress: true}))
    .pipe(gulp.dest(paths.dist + 'js' ))
    .pipe($.notify("Actualización de JS OK"));;
});

gulp.task('useref', function(){
  return gulp.src(paths.app + 'index.html')
    .pipe($.useref())
    .pipe($.gulpIf('*.js', $.uglify()))
    .pipe($.gulpIf('*.css', $.cssnano()))
    .pipe(gulp.dest(paths.dist))
});

gulp.task('images', function(){
  return gulp.src(paths.app + 'images/**/*.+(png|jpg|gif|svg|jpeg|ico)')
  .pipe($.imagemin())
  .pipe(gulp.dest(paths.dist + 'images'))
});

gulp.task('models', function() {
  return gulp.src(paths.app + 'data/**/*')
  .pipe(gulp.dest(paths.dist + 'data'))
})


gulp.task('views', function() {
  return gulp.src(paths.app + 'view/**/*')
  .pipe(gulp.dest(paths.dist + 'view'))
})


gulp.task('fonts', function() {
  return gulp.src(paths.app + 'fonts/**/*')
  .pipe(gulp.dest(paths.dist + 'fonts'))
})

gulp.task('clean:dist', function() {
  return $.del.sync('dist');
})

gulp.task('dist', function (callback) {
  $.runSequence('clean:dist', 'compass', 'views',
    ['useref', 'images', 'fonts','models'],
    callback
  )
    console.log('Building files');
})

gulp.task('browser-sync', function() {
    $.browserSync({
      server: {
        baseDir: './app',
        routes:  {
          '/bower_components': 'bower_components'
        }
      }
    });
});


gulp.task('serve', ['compass', 'browser-sync'], function () {
  gulp.watch(paths.app + "scss/**/*.scss", ['compass']);
});


gulp.task('test-dist', ['dist'], function() {
    $.browserSync({
        server: {
            baseDir: "./dist"
        }
        });
    });
gulp.task('build',['scssDist','jsDist']);
gulp.task('default', ['serve']);