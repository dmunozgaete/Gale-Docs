//------------------------------------------------------
// Company: Valentys Ltda.
// Author: dmunozgaete@gmail.com
// 
// Description: Dynamic Files Injector
// 
// URL: https://www.npmjs.com/package/grunt-html-build
//------------------------------------------------------
module.exports = function(grunt, options) {

	var conf = {
        development: {
            files: {
                'app/index.html': [
                    'bower.json',
                    'app/bundles/bundles.js',
                    'app/bundles/**/*.js',
                    'app/controllers/**/*.js',
                    'app/bundles/**/*.css'
                ]
            }
        },

        production: {
            files: {
                'app/index.html': [
                    'app/dist/**/*.min.js'
                ]
            }
        }
	};

    return {
        options: {
            ignorePath: '',
            relative: true,
            addRootSlash: false
        },
        files: conf[options.environment]
    };
};