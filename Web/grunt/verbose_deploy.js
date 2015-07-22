//------------------------------------------------------
// Company: Valentys Ltda.
// Author: dmunozgaete@gmail.com
// 
// Description: Lift Web Server , and run some tasks
//------------------------------------------------------
module.exports = function(grunt, options) {
    var run = function() {
        //-----------------------------------------------------------------------------
        //Clear Console
        var util = require('util');
        util.print("\u001b[2J\u001b[0;0H");
        grunt.log.ok("-------------------------------------------------------------------------");
        grunt.log.ok("Valentys Ltda.");
        grunt.log.ok("Contact: dmunoz@valentys.com");
        grunt.log.ok(" ");
        //SERVER INFO
        grunt.log.warn("Web server: " +
            options.server.protocol + "://" +
            options.server.hostname + ":" +
            options.server.port
        );
        //SERVER PATH INFO
        grunt.log.warn("Base path: '" +
            options.server.path + "'"
        );
        grunt.log.ok(" ");
        grunt.log.ok(" ");
        grunt.log.ok("Deploying...settings thing's up");
        grunt.log.ok("-------------------------------------------------------------------------");
        //-----------------------------------------------------------------------------
    };
    grunt.registerTask('verbose_deploy', run);
}
