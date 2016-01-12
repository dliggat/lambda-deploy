var AWS   = require('aws-sdk');
var util  = require('util');
var fs    = require('fs');

module.exports = function(grunt) {
  grunt.registerTask('create_stack', 'Create the CloudFormation stack', function() {
    var done = this.async();

    var cloudformation = new AWS.CloudFormation({cloudformation: '2010-05-15'});
    var params = {
      StackName: grunt.config('create_stack').stack,
      Capabilities: [
        'CAPABILITY_IAM'
      ],
      OnFailure: 'DELETE',
      TemplateBody: fs.readFileSync(grunt.config('create_stack').template, 'utf8'),
      TimeoutInMinutes: 15
    };
    cloudformation.createStack(params, function(err, data) {
      if (err) {
        grunt.fail.fatal(err, err.stack);
      } else {
        grunt.log.write(util.inspect(data)).ok();
      }
      done();
    });
  });

};
