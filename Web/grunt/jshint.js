module.exports = function(grunt, options) {

    grunt.registerTask('validate', ['jshint']);   //ALIAS

    var conf = {
        options: {
            curly: true,
            eqeqeq: true,
            eqnull: true,
            browser: true
        },

        controllers: {
            src: [
                'app/controllers/**/*.js'
            ]
        },

        bundles: {
            src: [
                'app/bundles/**/*.js'
            ]
        },

        core: {
            src: [
                'app/Application.js'
            ]
        }
    };

    if(grunt.option('report')){
        conf.options["reporter"] = require('jshint-stylish');
    }

    return conf;
};