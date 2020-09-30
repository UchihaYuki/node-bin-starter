const gulp = require('gulp');
const ts = require('gulp-typescript');
const rename = require('gulp-rename');
const mocha = require('gulp-mocha');
const del = require('del');
const shell = require('shelljs');
const sourcemaps = require('gulp-sourcemaps')
const argv = require('yargs').argv
const fs = require('fs')

const src = ts.createProject("src/tsconfig.json");
const srcRelease = ts.createProject("src/tsconfig-release.json");
const test = ts.createProject("test/tsconfig.json");

const starter = "node-bin-starter";

gulp.task("clean", () => del([
    ".tmp",
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
    shell.exec('pkg -t node12-linux-x64 -o dist/bin .')
    cb();
})

gulp.task('postpkg', () => del(['.tmp']))

gulp.task("test", gulp.series("clean", "build:src", "build:test", "run:test"));
gulp.task("build", gulp.series("test", "build:src-release", "pkg", 'postpkg'))

gulp.task('push', function (cb) {
    // if (!argv.m) {
    //     return cb(new Error("usage: gulp push -m <message>"))
    // }
    const message = argv.m || new Date().toISOString()

    let index = __dirname.lastIndexOf("/");
    if (index == -1) index = __dirname.lastIndexOf("\\");
    const parentDir = __dirname.slice(index + 1);
    if (parentDir != starter && !fs.existsSync('.init')) {
        return cb(new Error("project has not been initialized, run 'gulp init' to initialize project"))
    }

    shell.exec(`git add .`)
    shell.exec(`git commit -m ${message}`)
    shell.exec(`git push`)
    cb();
})

gulp.task('init', function (cb) {
    if (!argv.r) {
        return cb(new Error("usage: gulp init -r <repo>"))
    }
    
    let index = __dirname.lastIndexOf("/");
    if (index == -1) index = __dirname.lastIndexOf("\\");
    const parentDir = __dirname.slice(index + 1);
    if (parentDir == starter) {
        return cb(new Error(`${starter} doesn't need to be initialized`))        
    }

    if (fs.existsSync('.init')) {
        return cb(new Error("project has already been initialized"))
    }

    shell.exec(`git remote set-url origin ${argv.r}`);
    shell.exec(`touch .init`)
    shell.exec(`git add .`)
    shell.exec(`git commit -m init`)
    shell.exec(`git push -u origin master`)
    cb();
})