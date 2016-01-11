var grunt = require('grunt');
var AWS   = require('aws-sdk');
var util  = require('util');
var fs    = require('fs');

AWS.config.apiVersions = {
  cloudformation: '2010-05-15',
  ec2: '2015-10-01',
  s3: '2006-03-01',
  // other service API versions
};

grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    describe_stack: {
      stack: 'lambda2'
    },
    jshint: {
      files: ['Gruntfile.js', 'index.js'],
      options: {
        jshintrc: true,
        reporter: require('jshint-stylish')
      }
    },
    watch: {
      files: ['.jshintrc', '<%= jshint.files %>'],
      tasks: ['jshint']
    },
    lambda_invoke: {
        default: {
            options: {
            }
        }
    },
    lambda_deploy: {
        default: {
            arn: JSON.parse(require('fs').readFileSync('stack-outputs.json', 'utf8'))['StackOutputs']['LambdaFunctionARN'],
            options: {
                profile: 'dliggat'
            }
        }
    },
    lambda_package: {
        default: {
        }
    }
});


grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-aws-lambda');
grunt.registerTask('default', ['jshint']);
grunt.registerTask('deploy', ['lambda_package', 'lambda_deploy']);


// A very basic default task.
grunt.registerTask('describe_stack', 'Describe the CloudFormation stack', function() {
  var done = this.async();

  grunt.log.write('Logging some stuff from Dave...').ok();
  var cloudformation = new AWS.CloudFormation();
  var params = {
    StackName: grunt.config.get('describe_stack.' + this.target + '.stack')
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
    fs.writeFile('stack-outputs.json', JSON.stringify({'StackOutputs': stack}, null, 2), function(err) {
      if (err) {
        grunt.log.error(err);
      }
      done();
    });

  });


});
