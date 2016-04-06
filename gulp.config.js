module.exports = function() {
    var source = './src/';
    var tests = './test/**/*.js';

    var config = {
        alljs: [
            './src/**/*.js',
            tests
        ],
        build: './dist/',
        js: [
            source + '**/*.js'
        ],
        less: source + 'toaster.less',
        mainFile: 'toastr.js',
        source: source,
        tests: tests
    };

    return config;
};