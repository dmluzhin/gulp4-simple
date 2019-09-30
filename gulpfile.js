//Подключаем gulp модули
const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();

const cssFiles = [
	'./src/css/main.css',
	'./src/css/media.css'
];

const jsFiles = [
	'./src/js/lib.js',
	'./src/js/main.js'
];


//Для CSS
function styles() {

	//Шаблон для поиска файлов CSS
	return gulp.src(cssFiles)
			.pipe(concat('style.css'))

			//Автопрефиксер
			.pipe(autoprefixer({
				cascade: false
			}))

			.pipe(cleanCSS({
				level: 2
			}))

			//Вывод CSS в build
			.pipe(gulp.dest('./build/css'))
			.pipe(browserSync.stream());
}

//Для JS
function scripts() {
	return gulp.src(jsFiles)
			//Шаблон для поиска файлов JS
			.pipe(concat('main.js'))

			//Минифицируем JS
			.pipe(uglify())

			//Вывод JS в build
			.pipe(gulp.dest('./build/js'))
			.pipe(browserSync.stream());
}

//Watcher
function watch() {
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});
	gulp.watch('./src/css/**/*.css', styles)
	gulp.watch('./src/js/**/*.js', scripts)
	gulp.watch("./*.html").on('change', browserSync.reload)
}
//Чистка
function clean() {
	return del(['build/*'])
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('watch', watch);
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts)));

//Запускаем локальный сервер и отслеживаем (gulp dev)
gulp.task('dev', gulp.series('build', 'watch'));