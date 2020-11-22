const gulp = require('gulp');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const clean = require('gulp-clean');
const size = require('gulp-size');
const notify = require('gulp-notify');
const pug = require('gulp-pug');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserSync = require('browser-sync').create();



/* CONFIGS */
const src = './website';
const dist = './public';
const imagesPath = `${src}/images`;
const imagesDist = `${dist}/files/images`;
const publicFolder = `${dist}/files`;
const templatesBuildFolder = `${dist}/templates`;

const sizesOptions = {
    pretty: true,
    showFiles: true,
    showTotal: true
};

const scssFiles = ['global', 'pub-login', 'pub-digital-queue', 'pvt-admin', 'pvt-admin-digital-queues', 'pvt-register-user', 'pvt-digital-queue', 'pvt-create-digital-queue']
    .map(file => `${src}/scss/${file}.scss`);

const jsFiles = ['global', 'pub-login', 'pub-digital-queue', 'pvt-admin', 'pvt-admin-digital-queues', 'pvt-register-user', 'pvt-digital-queue', 'pvt-create-digital-queue']
    .map(file => `${src}/js/${file}.js`);

const templates = ['pub-login', 'pub-digital-queue', 'pvt-admin', 'pvt-admin-digital-queues', 'pvt-register-user', 'pvt-digital-queue', 'pvt-create-digital-queue']
    .map(file => `${src}/templates/${file}.pug`);


gulp.task('build-html', () => {
    return gulp.src(templates)
        .pipe(pug({pretty: true}).on('error', (error) => console.log(error)))
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


function buildJsFiles(_jsFiles) {
    return new Promise(function(resolve) {
        const filesQtd = _jsFiles.length;
        let currentFile = 0;

        _jsFiles.forEach(function(file) {
            const newFileNameSplit = file.split('/');
            const newFileName = newFileNameSplit[newFileNameSplit.length - 1];

            return browserify(file)
                .transform(babelify)
                .bundle()
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
                            console.log('Ending build-js');
                            resolve(true);
                        }
                    }
                }));
        });
    });
}
gulp.task('build-js', async function(done) {
    await buildJsFiles(jsFiles);

    jsFiles.forEach(function(file) {
        gulp.watch(file, function(_done) {
            buildJsFiles([file]);
            browserSync.reload();
            _done();
        });
    });

    done();
});

gulp.task('copy-images', () => {
    return gulp.src(`${imagesPath}/**/*`)
        .pipe(gulp.dest(imagesDist));
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


gulp.task('reload-browser', (done) => {
    browserSync.reload();
    done(); 
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

    gulp.watch(`${imagesPath}/**/*`, gulp.series('copy-images', 'reload-browser'));
    gulp.watch(`${src}/**/*.pug`, gulp.series('build-html', 'reload-browser'));
    gulp.watch(`${src}/**/*.scss`, gulp.series('build-scss'));
});


gulp.task('build', gulp.series('clean-public', 'clean-templates', 'build-scss', 'build-html', 'build-js', 'copy-images'));
gulp.task('development', gulp.series('build', 'watch-files'));
