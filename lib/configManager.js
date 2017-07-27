/**
 * List of settings to be loaded by environment
 * @class ConfigManager
 * @singleton
 */

const LOG_TAG = '\x1b[35m' + '[scripts/settings]' + '\x1b[39;49m ';

const _ = require('underscore');
const settings = require('./settings');

var ConfigManager = (function () {
	'use strict';
	// +-------------------
	// | Private members.
	// +-------------------

	// +-------------------
	// | Public members.
	// +-------------------

	/**
	 * @method load
	 * Obtains the settings list for the given environment
	 * @param {String} _environment Environment to obtain the settings from
	 * @return {Object} Object containing the list of settings
	 */
	function load(_configPath, _environment) {
		settings.doLog && console.log(LOG_TAG, '- load');

		const configList = require(_configPath);

		if (!configList) {
			throw new Error('config file not loaded: ' + _configPath);
		}

		if (!_environment) {
			throw new Error('You must define an environment to obtain the list of settings.');
		}

		if (!configList[_environment]) {
			throw new Error('Environment not defined in file: ' + _environment);
		}

		var result = JSON.parse(JSON.stringify(configList.global || {}));
		var envObj = JSON.parse(JSON.stringify(configList[_environment]));

		extendObject(result, envObj);

		return result;

		function extendObject(_object, _newObject) {
			_.each(_newObject, function (_value, _key) {
				var objVal = _object[_key];
				var newObjVal = _newObject[_key];

				if (_.isObject(objVal) && _.isObject(newObjVal)) {
					extendObject(objVal, newObjVal);
				} else {
					_object[_key] = newObjVal;
				}
			});
		}
	}

	return {
		load: load
	};
})();

module.exports = ConfigManager;
