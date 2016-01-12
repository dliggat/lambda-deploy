var AWS   = require('aws-sdk');
var util  = require('util');
var fs    = require('fs');

module.exports = function(grunt) {
  grunt.registerTask('describe_stack', 'Describe the CloudFormation stack', function() {
    var done = this.async();

    var cloudformation = new AWS.CloudFormation({cloudformation: '2010-05-15'});
    var params = {
      StackName: grunt.config('create_stack').stack
    };
    cloudformation.describeStacks(params, function(err, data) {
      if (err) {
        grunt.fail.fatal(err, err.stack);
      }
      var stack  = {};
      var status = data.Stacks[0].Outputs;
      for (var i in status) {
        stack[status[i].OutputKey] = status[i].OutputValue;
      }
      grunt.log.write(util.inspect(stack, {showHidden: false, depth: null})).ok();  // Inspect objects.
      fs.writeFile(grunt.config('describe_stack').outputs, JSON.stringify({'StackOutputs': stack}, null, 2), function(err) {
        if (err) {
          grunt.log.error(err);
        }
        done();
      });

    });
  });

};
