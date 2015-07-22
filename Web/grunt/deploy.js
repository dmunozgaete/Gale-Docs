//------------------------------------------------------
// Company: Valentys Ltda.
// Author: dmunozgaete@gmail.com
// 
// Description: Optimize Files for Production
//------------------------------------------------------
module.exports = function(grunt, options) {
    var run = function() {
        //-----------------------------------------------------------------------------
        grunt.log.ok("syncing package.json => bower.json"); 
        
        grunt.task.run('sync');
        grunt.task.run('clean:dist');
        grunt.task.run('bower_concat');
        grunt.task.run('concat');
        grunt.task.run('clean:post');
        grunt.task.run('uglify');
        grunt.task.run('injector:production');
        //grunt.task.run('verbose_deploy');
         
        //RUN CONNECT
        grunt.task.run('connect:production');
    };
    grunt.registerTask('deploy', run);
}
