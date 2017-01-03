'use strict';
const fs = require('fs'),
      Transform = require('stream').Transform,
      Writable = require('stream').Writable,
      spawn = require('child_process').spawn,
      chalk = require('chalk'),
      gulp = require('gulp'),
      htmlmin = require('gulp-htmlmin'),
      rename = require('gulp-rename'),
      stylus = require('gulp-stylus'),
      webpack = require('gulp-webpack'),
      base64 = require('gulp-base64'),
      uglify = require('gulp-uglify'),
      sourcemaps = require('gulp-sourcemaps'),
      autoprefixer = require('gulp-autoprefixer'),

      _develop = 'Z:/在线仿真网站/',
      _push = './.deploy_git/',

      opt = { cwd: _push };

//webpack设置
const webpackConfig = {
    output: {
        filename: 'script.min.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['es2015'],
                    plugins: ['transform-runtime']
                }
            }
        ]
    }
};
//缓存类
class Cache extends Writable {
    constructor() {
        super();
        this._cache = [];
    }
    _write(chunk, enc, next) {
        const buf = chunk instanceof Buffer
            ? chunk
            : Buffer.from(chunk, enc);

        this._cache.push(buf);
        next();
    }
    getCache(encoding) {
        encoding = encoding ? encoding : 'utf8';

        const buf = Buffer.concat(this._cache);
        return buf.toString(encoding).trim();
    }
}
//文件内容替换
function replace(search, replacement) {
    const ans = Transform({objectMode: true});

    ans._transform = function (buf, enc, next) {
        if (buf.isNull()) {
            return next(null, buf);
        }

        const buffer = buf._contents.toString('utf8')
            .replace(search, replacement);

        buf._contents = Buffer.from(buffer, 'utf8');

        next(null, buf);
    };

    return(ans);
}
//异步子进程
function promiseSpawn(command, args, options) {
    if (!command) { throw new TypeError('command is required!'); }

    if (!options && args && !Array.isArray(args)) {
        options = args;
        args = [];
    }

    args = args || [];
    options = options || {};

    return new Promise(function(resolve, reject) {
        const stdoutCache = new Cache(),
              stderrCache = new Cache(),
              task = spawn(command, args, options),
              encoding = options.hasOwnProperty('encoding')
                  ? options.encoding
                  : 'utf8';

        //流管道连接
        task.stdout.pipe(stdoutCache);
        task.stderr.pipe(stderrCache);

        //子进程结束
        task.on('close', function() {
            console.log(stdoutCache.getCache(encoding));
            resolve();
        });
        //子进程发生错误
        task.on('error', function(code) {
            const e = new Error(stderrCache.getCache(encoding));
            e.code = code;
            return reject(e);
        });
    });
}
//git操作入口
function git() {
    const len = arguments.length,
          args = new Array(len);

    for (let i = 0; i < len; i++) {
        args[i] = arguments[i];
    }

    if (args[0] === 'init') {
        //初始化，配置参数
        args[1] = args[1] || {};
        for (let i in args[1]) {
            if (args[1].hasOwnProperty(i)) {
                opt[i] = args[1][i];
            } 
        }
        //.git文件夹不存在，那么就需要初始化git
        if (!fs.existsSync((opt.cwd + '/.git').normalize())) {
            return promiseSpawn('git', ['init'], opt);
        }
        else {
            return new Promise((n) => n());
        }
    }
    else {
        //子进程运行git命令
        return (() => promiseSpawn('git', args, opt));
    }
}

gulp.task('dev-html', function() {
    return gulp.src('./index.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest(_develop));
});
gulp.task('dev-stylus', function () {
    return gulp.src('./css/main.styl')
        .pipe(sourcemaps.init())
        .pipe(stylus({compress: true}))
        .pipe(autoprefixer())
        .pipe(base64())
        .pipe(sourcemaps.write())
        .pipe(rename('circuitlab.min.css'))
        .pipe(gulp.dest(_develop + 'src/'));
});
gulp.task('dev-js', function () {
    return gulp.src('./js/main.js')
        .pipe(sourcemaps.init())
        .pipe(webpack(webpackConfig))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(_develop + 'src/'));
});
gulp.task('dev-image', function () {
    return gulp.src(['./img/favicons.ico', './img/circuit-grid.svg'])
        .pipe(gulp.dest(_develop + 'src/'));
});
gulp.task('build', ['dev-html', 'dev-stylus', 'dev-js', 'dev-image'], function () {
    //设置静态服务器
    const express = require('express'),
          app = express();

    //允许网页访问theme文件夹
    app.use(express.static(_develop));
    //建立虚拟网站，端口5000
    app.listen(5000, function () {
        console.log(chalk.green('\nINFO:') + ' 虚拟网站已建立于 http://localhost:5000/');
        console.log(chalk.green('INFO:') + ' CTRL + C 退出当前状态');
    });

    gulp.watch('./index.html', ['dev-html']);
    gulp.watch('./css/*.styl', ['dev-stylus']);
    gulp.watch('./js/*.js', ['dev-js']);
});

//发布
gulp.task('push', function () {
    function html(res) {
        gulp.src('./index.html')
            .pipe(htmlmin({
                collapseWhitespace: true,
                removeComments: true
            }))
            .pipe(gulp.dest(_push))
            .on('end', res);
    }
    function image(res) {
        gulp.src(['./img/favicons.ico', './img/circuit-grid.svg'])
            .pipe(gulp.dest(_push + 'src/'))
            .on('end', res);
    }
    function css(res) {
        gulp.src('./css/main.styl')
            .pipe(stylus({compress: true}))
            .pipe(autoprefixer())
            .pipe(base64())
            .pipe(rename('circuitlab.min.css'))
            .pipe(gulp.dest(_push + 'src/'))
            .on('end', res);
    }
    function js(res) {
        const temp = './js/main2.js',
              reg1 = /^((?:[^\n]?)+?import[^\n]+?\.\/test[^\n]+?)$/mg,
              reg2 = /^([^\n]+?mapTest[^\n]+?$)/mg;

        gulp.src('./js/main.js')
            .pipe(replace(reg1, '//$1'))
            .pipe(rename('main2.js'))
            .pipe(gulp.dest('./js/'))
            .pipe(webpack(webpackConfig))
            .pipe(replace(reg2, '//$1'))
            .pipe(uglify())
            .pipe(gulp.dest(_push + 'src/'))
            .on('end', () => { fs.unlinkSync(temp); res(); });
    }

    const url = 'https://github.com/xiaoboost/circuitlab.git',
          branch = 'gh-pages',
          promises = [html, image, css, js].map((n) => new Promise(n));

    Promise.all(promises)
        .then(git('init'))
        .then(git('add', '-A'))
        .then(git('commit', '-m', 'update'))
        .then(git('push', '-u', url, 'master:' + branch, '--force'))
        .then(() => console.log(chalk.green('\nINFO:') + ' 文件上传完毕'))
        .catch((err) => console.log(chalk.red('\nERROR:') + ' 发生错误，意外中止\n' + err));
});
