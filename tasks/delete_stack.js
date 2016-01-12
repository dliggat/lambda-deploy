var AWS   = require('aws-sdk');
var util  = require('util');

module.exports = function(grunt) {
  grunt.registerTask('delete_stack', 'Delete the CloudFormation stack', function() {
    var done = this.async();

    var cloudformation = new AWS.CloudFormation({cloudformation: '2010-05-15'});
    var params = {
      StackName: grunt.config('create_stack').stack
    };
    cloudformation.deleteStack(params, function(err, data) {
      if (err) {
        grunt.fail.fatal(err, err.stack);
      } else {
        grunt.log.write(util.inspect(data)).ok();
      }
      done();
    });
  });

};
