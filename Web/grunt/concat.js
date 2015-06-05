//------------------------------------------------------
// Company: Valentys Ltda.
// Author: dmunozgaete@gmail.com
// 
// Description: Unify all into one 'big' file
// 
// URL: https://www.npmjs.com/package/grunt-contrib-concat
// 
/// NOTE: If you want to add dependdencies THIS IS THE FILE ;)!
//------------------------------------------------------
module.exports = function(grunt, options) {
	
	var conf = {
		options: {
			separator: ';',
		},

		dependencies: {
			src: options.dependencies,	//FROM INJECTOR
			dest: 'app/dist/dependencies.js'
		},

		controllers: {
			src: [
				'app/controllers/**/*.js'
			],
			dest: 'app/dist/controllers.js'
		},

		sdk: {
			src: [
				'app/bundles/sdk/**/*.js'
			],
			dest: 'app/dist/sdk.js'
		},

		app: {
			src: [
				'app/bundles/app/js/**/*.js'
			],
			dest: 'app/dist/app.js'
		}
	};
	
	//---------------------------------------------------------------

    return conf;

};