tsc = "~/.typescript/bin/tsc"

module.exports = (grunt) ->

    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'
        ts:
            compile:
                src: ['src/**/*.ts']
                outDir: 'compiled'
                # src: ['src/index.ts']
                # dest: 'compiled/src/index.js'
                options:
                    failOnTypeErrors: true
                    module: 'commonjs'
                    target: 'es3'
                    sourceMap: false
                    # declaration: true

            test:
                src: ['test/**/*.ts']
                outDir: 'compiled'
                options:
                    failOnTypeErrors: true
                    module: 'commonjs'
                    target: 'es3'
                    sourceMap: false

            build:
                src: ['monapt.ts']
                out: 'dist/monapt.js'
                options:
                    failOnTypeErrors: true
                    module: 'commonjs'
                    target: 'es3'
                    sourceMap: false
                    declaration: true
        clean:
            type:
                src: ['compiled/**/*.js', 'compiled/**/*']
            build:
                src: ['dist/monapt.js', 'dist/monapt.min.js', 'dist/monapt.d.ts']

        uglify:
            min:
                files:
                    'dist/monapt.min.js': ['dist/monapt.js']
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

        umd:
            all:
                options:
                    src: 'dist/monapt.js'
                    objectToExport: 'monapt'

    grunt.loadNpmTasks 'grunt-ts'
    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-contrib-copy'
    grunt.loadNpmTasks 'grunt-contrib-connect'
    grunt.loadNpmTasks 'grunt-regarde'
    grunt.loadNpmTasks 'grunt-umd'
    
    grunt.registerTask 'compile', ['ts:compile', 'ts:test']
    grunt.registerTask 'default', ['compile']
    grunt.registerTask 'build', ['ts:build', 'umd:all', 'uglify']
    grunt.registerTask 'generate', ['compile', 'build', 'copy:public']
    grunt.registerTask 'preview', ['generate', 'connect:preview', 'regarde']

