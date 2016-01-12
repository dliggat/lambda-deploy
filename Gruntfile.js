var grunt = require('grunt');
var fs    = require('fs');

var outputsFile = 'stack-outputs.json';
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    create_stack: {
      stack: 'lambda2',
      template: 'stack-definition.json'
    },
    describe_stack: {
      outputs: outputsFile
    },
    jshint: {
      files: ['Gruntfile.js', 'index.js', 'tasks/*.js'],
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
            arn: JSON.parse(fs.readFileSync(outputsFile, 'utf8'))['StackOutputs']['LambdaFunctionARN'],
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
grunt.registerTask('deploy', ['create_stack',
                              'describe_stack',
                              'lambda_package',
                              'lambda_deploy']);


