/**
 * Manager for the tiapp.xml file
 * @class TiappManager
 * @singleton
 */

const LOG_TAG = '\x1b[35m' + '[scripts/tiappManager]' + '\x1b[39;49m ';

const tiappXml = require('tiapp.xml');
const _ = require('underscore');
const settings = require('./settings');

var TiAppManager = (function () {
	'use strict';
	// +-------------------
	// | Private members.
	// +-------------------

	var tiapp = null;

	/**
	 * @method updateAndroidActivity
	 * @private
	 * Updates the main activity name for android based on the given app name
	 * @param {String} _appName Name to update
	 * @return {void}
	 */
	function updateAndroidActivity(_appName) {
		settings.doLog && console.log(LOG_TAG, '- updateAndroidActivity');

		var tiappDoc = tiapp.doc;
		var androidElement;
		var manifestElement;
		var activityElement;

		androidElement = getFirstNodeByName(tiappDoc, 'android');

		if (!androidElement) {
			settings.doLog && console.warn(LOG_TAG, 'Android name not updated, <android> tag not found');

			return false;
		}

		manifestElement = getFirstNodeByName(androidElement, 'manifest');

		if (!manifestElement) {
			settings.doLog && console.warn(LOG_TAG, 'Android name not updated, <manifest> tag not found');

			return false;
		}

		activityElement = getFirstNodeByName(manifestElement, 'activity');

		if (!activityElement) {
			settings.doLog && console.warn(LOG_TAG, 'Android name not updated, <activity> tag not found');

			return false;
		}

		activityElement.setAttribute('android:name', generateAndroidAppName(_appName));
	}

	/**
	 * @method generateAndroidAppName
	 * @private
	 * Generates the app name for android given the app name
	 * @param {String} _appName Name to translate
	 * @return {String}
	 */
	function generateAndroidAppName(_appName) {
		settings.doLog && console.log(LOG_TAG, '- generateAndroidAppName');

		var appName = '' + _appName;
		var words = null;

		appName = appName.replace(/[^\w\W ]/g, '');

		words = appName.split(' ');
		words = _.map(words, function (_word) {
			return _word.charAt(0).toUpperCase() + _word.substring(1).toLowerCase();
		});

		return '.' + words.join('') + 'Activity';
	}

	/**
	 * @method getFirstNodeByName
	 * @private
	 * Looks for the first node with the given tag name from the given element
	 * @param {Element} _element Where to llok for the tag element
	 * @param {String} _tagName Name of the tag to look for
	 * @return {Element} Found element, `null` if not Found
	 */
	function getFirstNodeByName(_element, _tagName) {
		settings.doLog && console.log(LOG_TAG, '- getFirstNodeByName');

		var nodesList = _element.getElementsByTagName(_tagName);

		if (nodesList && nodesList.length > 0) {
			return nodesList.item(0);
		}

		return null;
	}

	/**
	 * @method formatVersion
	 * @private
	 * Generates a version string based on the given format
	 * @param {String} _format Format to apply
	 * @return {String} version value
	 */
	function formatVersion(_format) {
		if (!_format || !_.isString(_format)) {
			throw new Error('Format must be a non-empty string:' + _format);
		}

		settings.doLog && console.log(LOG_TAG, '- formatVersion');

		var version = tiapp.version;
		var formatValues = _format.split('.');
		var versionValues = version.split('.');
		var result = _.map(formatValues, function (_formatValue) {
			var versionPartValue = _formatValue;
			var isNumber = !_.isNaN(parseInt(_formatValue, 10));

			if (isNumber) {
				return versionPartValue;
			}

			var formatValues = _formatValue.split('|');

			switch (formatValues[0]) {
			case 'major':
				versionPartValue = versionValues[0] || '0';
				break;
			case 'minor':
				versionPartValue = versionValues[1] || '0';
				break;
			case 'build':
				versionPartValue = versionValues[2] || '0';
				break;
			default:
				settings.doLog && console.warn(LOG_TAG, 'Invalid format value: ' + _formatValue);
				versionPartValue = '0';
			}

			if (formatValues.length > 1) {
				versionPartValue = _.reduce(_.rest(formatValues), versionPartValueReducer, versionPartValue);
			}

			return versionPartValue;
		});

		return result.join('.');
	}

	/**
	 * @method versionPartValueReducer
	 * @private
	 * Reducer function for applying the "functions" within the version parts
	 * @param {String} _value Current value of the version part
	 * @param {String} _function Function to apply in the version part
	 * @param {Number} _index index value of the function to be applied.
	 * @return {String} updated value part of the version
	 */
	function versionPartValueReducer(_value, _function, _index) {
		settings.doLog && console.log(LOG_TAG, '- versionPartValueReducer');
		var result = _value;

		switch (_function) {
		case 'bump':
			result = parseInt(_value, 10);
			return '' + (result + 1);
		}
	}

	// +-------------------
	// | Public members.
	// +-------------------

	/**
	 * @method updateConfigs
	 * Updates all the xml settings fromt he given object
	 * @param {Object} _tiappXmlPath Path to the tiapp.xml file
	 * @param {Object} _configs Settings to update on the tiapp.xml file
	 * @param {Boolean} _save Flag to apply the changes on the file
	 * @return {void}
	 */
	function updateConfigs(_tiappXmlPath, _configs, _save) {
		settings.doLog && console.log(LOG_TAG, '- updateConfigs');

		tiapp = tiappXml.load(_tiappXmlPath);

		if (!_configs || !_.isObject(_configs)) {
			throw new Error('configs not correctly defined: ' + JSON.stringify(_configs));
		}

		if (_configs.guid) {
			tiapp.guid = _configs.guid;
		}

		if (_configs.properties) {
			_.each(_configs.properties, function (_value, _name) {
				tiapp.setProperty(_name, _value, 'string');
			});
		}

		if (_configs.appId) {
			tiapp.id = _configs.appId;
		}

		if (_configs.appName) {
			tiapp.name = _configs.appName;

			updateAndroidActivity(_configs.appName);
		}

		if (_configs.version) {
			tiapp.version = _configs.version;
		}

		if (_configs['version:format']) {
			tiapp.version = formatVersion(_configs['version:format']);
		}

		_save && tiapp.write();
	}

	/**
	 * @method getTiappXml
	 * Prints the tiapp.xml file
	 * @return {String}
	 */
	function getTiappXml() {
		settings.doLog && console.log(LOG_TAG, '- getTiappXml');

		return tiapp.toString();
	}

	return {
		updateConfigs: updateConfigs,
		getTiappXml: getTiappXml
	};
})();

module.exports = TiAppManager;
