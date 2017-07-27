/**
 * Primary lib for updating the tiapp.xml based on the given confis and environment
 * @class Tiapp-updater
 * @singleton
 */

const LOG_TAG = '\x1b[35m' + '[scripts/tiappUpdater]' + '\x1b[39;49m ';

const minimist = require('minimist');
const path = require('path');
const configManager = require('./configManager');
const tiappManager = require('./tiappManager');
const settings = require('./settings');

var TiAppUpdater = (function () {
	'use strict';
	// +-------------------
	// | Private members.
	// +-------------------

	// +-------------------
	// | Public members.
	// +-------------------

	/**
	 * @method updateTiapp
	 * Updates the given tiapp.xml file
	 * @param {Object} _params List of options for updating the tiapp file
	 * @param {String} _params.tiapp Path for the tiapp.xml file to update
	 * @param {String} _params.config Path for the config file to use
	 * @param {String} _params.env Environemtn to use from the config file
	 * @param {Boolean} [_params.doLog=false] flag to show logs for debugging
	 * @param {Boolean} [_params.save=false] flag to save the new tiapp in the given tiapp.xml file
	 * @return {void}
	 */
	function updateTiapp(_params) {
		const params = _params || {};

		const cwd = process.cwd();
		const tiappPath = params.tiapp;
		const save = params.save || false;
		var configPath = params.config;
		var configs = null;

		if (!path.isAbsolute(configPath)) {
			configPath = path.join(cwd, configPath);
		}

		settings.doLog = !!params.doLog;
		settings.doLog && console.log(LOG_TAG, '- updateTiapp');

		configs = configManager.load(configPath, params.env);
		tiappManager.updateConfigs(tiappPath, configs, save);

		return tiappManager.getTiappXml();
	}

	return {
		updateTiapp: updateTiapp
	};
})();

module.exports = TiAppUpdater;
