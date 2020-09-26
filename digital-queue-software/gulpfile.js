const gulp = require('gulp');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const clean = require('gulp-clean');
const size = require('gulp-size');
const notify = require('gulp-notify');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserSync = require('browser-sync').create();


/* CONFIGS */
const src = './website/src';
const dist = './public';
const publicFolder = `${dist}/files`;
const templatesBuildFolder = `${dist}/templates`;

const sizesOptions = {
    pretty: true,
    showFiles: true,
    showTotal: true
};

const scssFiles = ['common', 'home']
    .map(file => `${src}/scss/${file}.scss`);

const jsFiles = ['home']
    .map(file => `${src}/js/${file}.js`);

const templates = ['home']
    .map(file => `${src}/templates/${file}.html`);


gulp.task('copy-html', function() {
    return gulp.src(templates)
        .pipe(gulp.dest(templatesBuildFolder));
});


gulp.task('build-scss', function() {
    const s = size(sizesOptions);

    return gulp.src(scssFiles)
        .pipe(sass({outputStyle: 'compressed', includePaths: ['node_modules']}).on('error', sass.logError))
        .pipe(s)
        .pipe(gulp.dest(`${publicFolder}/css`))
        .pipe(browserSync.stream());
});


gulp.task('build-js', function(done) {
    const filesQtd = jsFiles.length;
    let currentFile = 0;

    jsFiles.forEach(file => {
        const newFileNameSplit = file.split('/');
        const newFileName = newFileNameSplit[newFileNameSplit.length - 1];

        return browserify(file)
            .transform(babelify)
            .bundle().on('error', (error) => {
                console.log(error);
            })
            .pipe(source(newFileName))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(gulp.dest(`${publicFolder}/js`))
            .pipe(notify({
                onLast: false,
                message: () => {
                    console.log(`${newFileName} builded`);

                    currentFile++;
                    if (currentFile === filesQtd) {
                        done();
                        browserSync.reload();
                    }
                }
            }));
    });
});

gulp.task('clean-public', () => {
    return gulp.src(publicFolder, { allowEmpty: true })
        .pipe(clean({force: true}))
        .on('error', (error) => {
            console.log(error);
        });
});

gulp.task('clean-templates', () => {
    return gulp.src(templatesBuildFolder, { allowEmpty: true })
        .pipe(clean({force: true}))
        .on('error', (error) => {
            console.log(error);
        });
});


gulp.task('watch-files', () => {
    browserSync.init({
        port: 5000,
        open: false,
        injectChanges: true,
        reloadDebounce: 2000,
        reloadOnRestart: true,
        proxy: 'http://localhost:3000',
        serveStatic: [
            {
                route:'/css',
                dir: `${dist}/css`
            },
            {
                route:'/js',
                dir: `${dist}/js`
            }
        ]
    });

    gulp.watch(`${src}/**/*.html`, gulp.series('copy-html'));
    gulp.watch(`${src}/**/*.scss`, gulp.series('build-scss'));
    gulp.watch(`${src}/**/*.js`, gulp.series('build-js'));
});


gulp.task('build', gulp.series('clean-public', 'clean-templates', 'build-scss', 'copy-html', 'build-js'));
gulp.task('watch', gulp.series('watch-files'));
gulp.task('development', gulp.series('build', 'watch'));