var grunt = require('grunt');
grunt.loadNpmTasks('grunt-aws-lambda');

grunt.initConfig({
    lambda_invoke: {
        default: {
            options: {
            }
        }
    },
    lambda_deploy: {
        default: {
            arn: 'arn:aws:lambda:us-west-2:550196518397:function:lambda2-DaveLambda-1788FJ8TWOEMY',
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

grunt.registerTask('deploy', ['lambda_package', 'lambda_deploy']);

// A very basic default task.
grunt.registerTask('foobar', 'Log some stuff.', function() {
  grunt.log.write('Logging some stuff from Dave...').ok();
});
