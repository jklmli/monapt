tsc = "~/.typescript/bin/tsc"

module.exports = (grunt) ->

    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'
        typescript:
            compile:
                src: ['src/**/*.ts']
                dest: 'compiled'
                # src: ['src/index.ts']
                # dest: 'compiled/src/index.js'
                options:
                    module: 'commonjs'
                    target: 'es3'
                    # sourcemap: true
                    # declaration: true

            test:
                src: ['test/**/*.ts']
                dest: 'compiled'
                options:
                    module: 'commonjs'
                    target: 'es3'

            build:
                src: ['monapt.ts']
                dest: 'monapt.js'
                options:
                    module: 'commonjs'
                    target: 'es3'
                    # sourcemap: true
                    declaration: true
        clean:
            type:
                src: ['compiled/**/*.js', 'compiled/**/*']
            build:
                src: ['monapt.js', 'monapt.min.js', 'monapt.d.ts']

        uglify:
            min:
                files:
                    'monapt.min.js': ['monapt.js']
            ###
            options:
                mangle:
                    expect: ['jQuery']
                sourceMap: 'build/source-map.js'
            ###

        copy:
            public:
                files: [
                        expand: true
                        cwd: 'build'
                        src: '**'
                        dest: 'public/javascript'
                    ,
                        expand: true
                        cwd: 'res'
                        src: '**'
                        dest: 'public/'
                ]

        connect:
            preview:
                options:
                    port: 9000
                    base: 'public'

        regarde:
            src:
                files: ['src/**/*.*']
                tasks: ['generate']

    grunt.loadNpmTasks 'grunt-typescript'
    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-contrib-copy'
    grunt.loadNpmTasks 'grunt-contrib-connect'
    grunt.loadNpmTasks 'grunt-regarde'
    
    grunt.registerTask 'compile', ['typescript:compile', 'typescript:test']
    grunt.registerTask 'default', ['compile']
    grunt.registerTask 'build', ['typescript:build', 'uglify']
    grunt.registerTask 'generate', ['compile', 'build', 'copy:public']
    grunt.registerTask 'preview', ['generate', 'connect:preview', 'regarde']

