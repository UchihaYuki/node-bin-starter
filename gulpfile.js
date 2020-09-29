const gulp = require('gulp');
const ts = require('gulp-typescript');
const rename = require('gulp-rename');
const mocha = require('gulp-mocha');
const del = require('del');
const shell = require('shelljs');
const sourcemaps = require('gulp-sourcemaps')

const src = ts.createProject("src/tsconfig.json");
const srcRelease = ts.createProject("src/tsconfig-release.json");
const test = ts.createProject("test/tsconfig.json");

gulp.task("clean", () => del([
    "dist",
    "src/**/*.js",
    "src/**/*.js.map",
    "test/**/*.js",
    "test/**/*.js.map"]));

gulp.task("build:src", () => gulp
    .src([
        "src/**/*.ts",
    ])
    .pipe(sourcemaps.init())
    .pipe(src())
    .pipe(sourcemaps.write(".", { sourceRoot: '.', includeContent: false }))
    .pipe(gulp.dest("src")));

gulp.task("build:test", () => gulp
    .src(["test/**/*.ts"])
    .pipe(sourcemaps.init())
    .pipe(test())
    .pipe(sourcemaps.write(".", { sourceRoot: '.', includeContent: false }))
    .pipe(gulp.dest("test")));

gulp.task("run:test", () => gulp
    .src(["test/**/*.js"], { read: false })
    .pipe(mocha({ reporter: "spec", timeout: 30000 })));

gulp.task("build:src-release", () => gulp
    .src([
        "src/**/*.ts",
        "!src/environments/environment.ts"
    ])
    .pipe(rename(function (path) {
        // Returns a completely new object, make sure you return all keys needed!
        return {
            dirname: path.dirname,
            basename: path.basename == 'environment.prod' ? 'environment' : path.basename,
            extname: path.extname
        };
    }))
    .pipe(srcRelease())
    .pipe(gulp.dest(".tmp")));

gulp.task('pkg', function (cb) {
    shell.exec('pkg -t node8-linux-x64 -o dist/server .')
    cb();
})

gulp.task('postpkg', () => del(['.tmp']))

gulp.task("test", gulp.series("clean", "build:src", "build:test", "run:test"));
gulp.task("dist", gulp.series("test", "build:src-release", "pkg", 'postpkg'))