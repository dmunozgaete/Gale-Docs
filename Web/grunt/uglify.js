//------------------------------------------------------
// Company: Valentys Ltda.
// Author: dmunozgaete@gmail.com
// 
// Description: Minify and unify javascript or css files
// 
// URL: https://www.npmjs.com/package/grunt-contrib-uglify
// 
// NOTE: If you want to add dependencies , GO TO CONCAT.JS
//------------------------------------------------------
module.exports = function(grunt, options) {
    var conf = {
    	options: {  
            compress: true,
            mangle: false,
            sourceMap: true
        },  
        
        dependencies: {
            src: [
                'app/dist/dependencies.js'
            ],
            dest: 'app/dist/dependencies.min.js'
        },

        controllers: {
            src: [
                'app/dist/controllers.js'
            ],
            dest: 'app/dist/controllers.min.js'
        },

        sdk: {
            src: [
                'app/dist/sdk.js'
            ],
            dest: 'app/dist/sdk.min.js'
        },

        app: {
            src: [
                'app/dist/app.js'
            ],
            dest: 'app/dist/app.min.js'
        }
    };

    return conf;
};