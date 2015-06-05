module.exports = function(grunt) {
    var path = require('path');
    var config = {

        //Global Configuration
        data: {
            environment: grunt.option('env')||'development',
            server: {
                hostname: 'localhost',
                port: 8000,
                protocol: 'http',
                path: ''
            },
            banner: {
                date_version: grunt.template.today("yyyy-mm-dd"),
                company: 'Valentys Ltda.',
                author: 'David Antonio Muñoz Gaete',
                email: 'dmunozgaete@gmail.com'
            },
            livereload: !grunt.option('no-livereload'),
            openBrowser: grunt.option('open-browser')
        }
    };

    require('load-grunt-config')(grunt, config);
};
