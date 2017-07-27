/**
 * Main tests for the module
 * @class Test.index
 * @singleton
 */
const assert = require('assert');
const tiappUpdater = require('../lib/tiapp-updater');

var Test = (function () {
	'use strict';

	describe('tiapp-updater', function () {

		describe('#updateTiapp()', function () {
			const config = 'test/tiapp-config.json';
			const tiapp = 'test/tiapp.xml';

			it('should update AppID', function () {
				const env = 'pre-prod';
				const newTiapp = tiappUpdater.updateTiapp({
					tiapp: tiapp,
					config: config,
					env: env
				});

				const expected = 'com.test.preprod';
				const real = /<id>([a-z\.]+)<\/id>/.exec(newTiapp)[1];

				assert.equal(expected, real);
			});

			it('should update version', function () {
				const env = 'prod';
				const newTiapp = tiappUpdater.updateTiapp({
					tiapp: tiapp,
					config: config,
					env: env
				});

				const expected = '1.0';
				const real = /<version>([0-9\.]+)<\/version>/.exec(newTiapp)[1];

				assert.equal(expected, real);
			});

			it('should bump version', function () {
				const env = 'dev';
				const newTiapp = tiappUpdater.updateTiapp({
					tiapp: tiapp,
					config: config,
					env: env
				});

				const expected = '1.0.1.0';
				const real = /<version>([0-9\.]+)<\/version>/.exec(newTiapp)[1];

				assert.equal(expected, real);
			});

			it('should update app name', function () {
				const env = 'test';
				const newTiapp = tiappUpdater.updateTiapp({
					tiapp: tiapp,
					config: config,
					env: env
				});

				const expected = 'My App TEST';
				const real = /<name>([\w\.\s/\-_]+)<\/name>/.exec(newTiapp)[1];

				assert.equal(expected, real);
			});

			it('should update guid', function () {
				const env = 'prod';
				const newTiapp = tiappUpdater.updateTiapp({
					tiapp: tiapp,
					config: config,
					env: env
				});

				const expected = '22222222-2222-2222-2222-222222222222';
				const real = /<guid>([\d\-]+)<\/guid>/.exec(newTiapp)[1];

				assert.equal(expected, real);
			});
		});
	});
})();

module.exports = Test;
