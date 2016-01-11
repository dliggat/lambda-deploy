var grunt = require('grunt');
var fs    = require('fs');

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
grunt.loadTasks('tasks');
grunt.registerTask('default', ['jshint']);
grunt.registerTask('deploy', ['lambda_package', 'lambda_deploy']);


