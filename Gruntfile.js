module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    var globalConfigs = {};
    
    var watchFiles = {
        serverViews: ['app/views/**/*.*'], 
        serverJS: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js'],
        mochaTests: ['app/tests/**/*.js']
    };

    grunt.initConfig({

        globalConfigs : {
            
            src : 'public',
            dist : '<%= globalConfigs.src %>/dist'
 
        },


        watch: {

            js: {
                files: [
                    '<%= globalConfigs.src %>/**/*.js'
                ],
                tasks: ['default']
            }

        },


        jshint: {
            jshintrc: '.jshintrc',
            beforeconcat: ['<%= globalConfigs.src %>/**/*.js']
        },

        jasmine: {

            build: {
                src: '<%= globalConfigs.src %>/validation-all.js',
                options: {
                    specs: 'test/**/*Test.js'
                }
            }
        },


        /**
         * NODE SERVER
         */

        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    //nodeArgs: ['--debug'],
                    ext: 'js,html',
                    watch: watchFiles.serverViews.concat(watchFiles.serverJS)
                }
            }
        },
        'node-inspector': {
            custom: {
                options: {
                    'web-port': 1337,
                    'web-host': 'localhost',
                    //'debug-port': 5858,
                    'save-live-edit': true,
                    'no-preload': true,
                    'stack-trace-limit': 50,
                    'hidden': []
                }
            }
        },

        concurrent: {
            default: ['nodemon', 'watch'],
            debug: ['nodemon', 'watch', 'node-inspector'],
            options: {
                logConcurrentOutput: true
            }
        }

    });


    // A Task for loading the configuration object
    grunt.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function() {
        
        var init = require('./config/init')();
        var config = require('./config/config');
        
        grunt.config.set('applicationJavaScriptVendors', config.assets.lib.js);
        grunt.config.set('applicationJavaScriptFiles', config.assets.js);
        grunt.config.set('applicationCSSFiles', config.assets.css);
    });

    grunt.registerTask('testOnly',  ['jasmine']);
    grunt.registerTask('codequalityOnly', ['jshint']);



    //grunt.registerTask('default', ['build', 'concurrent:default']);

    grunt.registerTask('default', ['concurrent:default']);
    

    grunt.registerTask('serve', ['default', 'watchFiles']);
    grunt.registerTask('test',  ['build', 'jasmine']);
    grunt.registerTask('codeQuality',  ['build', 'jshint']);


    //grunt.registerTask('build', ['clean', 'loadConfig', 'concat:app', 'concat:vendor', 'cssmin', 'uglify']);//, 'compress']);

}
