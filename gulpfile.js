const {src, dest, watch, parallel} = require ("gulp");
// CSS
const sass = require ("gulp-sass")(require('sass'));
const plumber = require ('gulp-plumber');
const postcss = require ('gulp-postcss');
const cssnano = require ('cssnano');
const autoprefixer = require ('autoprefixer');
const sourcemaps = require ('gulp-sourcemaps');
//imagenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');
//JavaScript
const terser = require('gulp-terser');



function css(done) {
    src("src/scss/**/*.scss") //Identificar archivo SASS
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass())  //Compilar archivo SASS
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest("public/build/css")) //Almacenar en disco duro
    done(); // Callback que avisa ca gulp cuando termina la funcion. (TAREA)
}

function imagenes(done) {
    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{png, jpg}')
    .pipe(cache(imagemin(opciones)))
    .pipe(dest('public/build/img'))
    done();
}

function versionWebp (done) {

    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
    .pipe(webp(opciones))
    .pipe(dest('public/build/img'))
    done();
}

function versionAvif (done) {

    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
    .pipe(avif(opciones))
    .pipe(dest('public/build/img'))
    done();
}

function javascript(done) {
    src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('public/build/js'));
    done();
}

function dev(done) {
    watch("src/SCSS/**/*.scss", css)
    watch("src/js/**/*.js", javascript);
    done();
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionAvif, versionWebp, javascript, [dev]);

