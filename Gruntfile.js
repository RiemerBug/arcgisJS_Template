module.exports = function (grunt) {
    // Build customizations would be left up to developer to implement.
    grunt.loadNpmTasks('grunt-dojo');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.loadNpmTasks("grunt-tslint");

    grunt.loadNpmTasks('grunt-processhtml');

    grunt.initConfig({
        watch: {
            ts: {
                files: ['./src/app/**/*.ts'],
                tasks: ['tslint']
            },
            php: {
                files: [
                    './src/*.*',
                    './src/app/*.php',
                    './src/app/resources/**/*',
                    './src/app/store/**/*'
                ],
                tasks: ['copy:dev']
            },
            css: {
                files: ['./src/app/style/*.scss'],
                tasks: ['sass']
            }
        },

        clean: {
            dev: {
                src: ['dist/*.*', 'dist/app/']
            },
            build: {
                src: ['build/']
            },
            uncompressed: {
                src: [
                    'dist/**/*.uncompressed.js'
                ]
            }
        },
        copy: {
            dev: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['*.*',
                        'app/**/*.php',
                        'app/resources/**/*',
                        'app/store/**/*'],
                    dest: './dist/'
                }]
            },
            build: {
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: [
                        '!**/.gitkeep',
                        '*.*', '!index.php', '!dojoConfig,js',
                        'app/**/*.php',
                        'app/resources/**/*',
                        'app/store/**/*'],
                    dest: './build/'
                }]
            }
        },
        dojo: {
            build: {
                options: {
                    releaseDir: '../build'
                }
            },
            options: {
                profile: 'build.profile.js',
                dojo: 'dist/dojo/dojo.js',
                load: 'build',
                cwd: './',
                basePath: './dist'
            }
        },

        processhtml: {
            build: {
                files: {
                    'built/index.php': 'dist/index.php'
                }
            }
        },

        sass: {
            options: {
                outputStyle: 'nested',
                sourceMap: true
            },
            dist: {
                files: {
                    'dist/app/style/main.css': 'src/app/style/main.scss'
                }
            }
        },

        cssmin: {
            mincss: {
                options: {
                    report: 'min',
                    level: {
                        1: {
                            all: true
                        },
                        2: {
                            all: true
                        }
                    }
                },
                expand: true,
                cwd: 'dist/app/style/',
                src: ['*.css'],
                dest: 'build/app/style/',
                ext: '.css'
            }
        },

        tslint: {
            options: {
                // can be a configuration object or a filepath to tslint.json
                configuration: "tslint.json",
                // If set to true, tslint errors will be reported, but not fail the task
                // If set to false, tslint errors will be reported, and the task will fail
                force: false,
                fix: true
            },
            files: {
                src: [
                    "./src/app/**/*.ts"
                ]
            }
        }
    });

    grunt.registerTask('init', ['clean:dev', 'tslint', 'copy:dev', 'sass']);
    grunt.registerTask('dev', ['watch']);
    grunt.registerTask('build', ['clean:build', 'dojo', 'processhtml', 'copy:build', 'cssmin', 'clean:uncompressed']);

};
