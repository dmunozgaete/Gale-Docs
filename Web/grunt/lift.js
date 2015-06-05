//------------------------------------------------------
// Company: Valentys Ltda.
// Author: dmunozgaete@gmail.com
// 
// Description: Lift Web Server , and run some tasks
//------------------------------------------------------
module.exports = function(grunt, options) {
	
	var tasks = [];

	tasks.push('clean');
	
	if(options.environment == "production"){
		tasks.push('concat');
		tasks.push('uglify');
	}
	
	tasks.push('injector');
	tasks.push('connect:server');

	if(options.livereload){
		tasks.push('watch');
	}

	var verbose = function(){
        
        //Clear Console
		var util = require('util');
		util.print("\u001b[2J\u001b[0;0H");

		grunt.log.ok("-------------------------------------------------------------------------");
		grunt.log.ok("Valentys Ltda.");
		grunt.log.ok("AngularJS Seed Template");
		grunt.log.ok("Contact: dmunozgaete@gmail.com");
		grunt.log.ok(" ");

		//DEPLOY INGO
		grunt.log.warn("Environment: " + 
			options.environment
		);

		//SERVER INFO
		grunt.log.warn("Web server: " + 
			options.server.protocol + "://" + 
			options.server.hostname + ":" + 
			options.server.port
		);

		//LIVE RELOAD
		if(options.livereload){
			grunt.log.warn("Livereload: enabled, (to disable set arg --no-livereload when run grunt)");
		}else{
			grunt.log.warn("Livereload: disabled");
		}

		//SERVER PATH INFO
		grunt.log.warn("Base path: '" + 
			options.server.path + "'"
		);
		grunt.log.ok(" ");

		grunt.log.ok(" ");
				
		grunt.log.ok("Lifting...settings thing's up");
		grunt.log.ok("-------------------------------------------------------------------------");
        

        //Other TASKS
        for(var task in tasks){
        	grunt.task.run(tasks[task]);
        }
    };

	grunt.registerTask('lift', verbose);

}