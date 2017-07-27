var child_process = require('child_process');

module.exports = function (grunt) {

	// Configure the plugins
	grunt.initConfig({
		jsbeautifier: {
			files: [
				'.jsbeautifyrc',
				'.jscsrc',
				'.jshintrc',
				'*.json',
				'*.js',
				'lib/**/*.js',
				'bin/**/*.js',
				'test/**/*.js'
			],
			options: {
				config: '.jsbeautifyrc'
			}
		},
		jshint: {
			all: {
				src: [
					'*.json',
					'*.js',
					'lib/**/*.js',
					'bin/**/*.js',
					'test/**/*.js'
				]
			},
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			}
		},
		jscs: {
			options: {
				config: '.jscsrc'
			},
			all: {
				src: [
					'*.json',
					'*.js',
					'lib/**/*.js',
					'bin/**/*.js',
					'test/**/*.js'
				]
			}
		},
		jsduck: {
			options: {
				config: 'docs/jsduck.json'
			},
			all: {
				src: [
					'*.json',
					'*.js',
					'lib/**/*.js',
					'bin/**/*.js',
					'test/**/*.js'
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jsbeautifier');

	grunt.registerTask('default', [
		'jsbeautifier',
		'jshint:all'
	]);
};
