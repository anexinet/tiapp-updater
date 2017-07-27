# tiapp-updater

## Introduction
![image](images/tiapp-updater-intro.gif)

For Titanium projects. Automatically updates the tiapp.xml file  based on a given configguration file and an environment to load from that config file.

## Basic usage

### From CLI:

```bash
$ npm install --save-dev tiapp-updater

$ ./node_modules/js-updater/bin/jsupdater --tiapp <path-to-your-tiapp.xml-file> --config <path-to-your-config-json-file> --env <env-to-load> [--save]
```

### From Node:

```javascript
var tiappUpdater = require('tiapp-updater');

newTiapp = tiappUpdater.updateTiapp({
	tiapp: 'path-to-tiapp.xml',
	config: 'path-to-config.json',
	env: 'env-to-load',
	save: true // false to prevent the tiapp.xml file to be edited
});

console.log(newTiapp);
```

## Config file and environment

The config file can be a JSON file or any JS file that returns an object.

An environment (`env`) is any first-level key loaded from the config file.

There could be an special `global` key inside the config file. If `global` is defined, the properties will be applied in cascade (`global` then `env` will replace the repeated properties).

### Example config.json

```json
{
    "global": {
    	"appId": "com.test.generic",
    	"appName": "Generic Name",
        "guid": "11111111-1111-1111-1111-111111111111",
        "version:format": "major.minor.build",
        "properties": {
            "appc-app-id": "111111111111111111111111"
        }
    },
    "dev": {
        "appId": "com.test.dev",
        "appName": "My App DEV",
        "version:format": "major.minor.build|bump.0"
    },
    "test": {
        "appId": "com.test.test",
        "appName": "My App TEST",
        "version:format": "major.minor.build.1"
    },
    "pre-prod": {
        "appId": "com.test.preprod",
        "appName": "My App PRE-PROD",
        "version:format": "major.minor.build.2"
    },
    "prod": {
        "appId": "com.test.prod",
        "appName": "My App",
        "guid": "22222222-2222-2222-2222-222222222222",
        "version:format": "major.minor",
        "properties": {
            "appc-app-id": "app-id-prod"
        }
    }
}
```

### Properties supported

- **`appId`** modifies the `<id>com.app.identifier</id>` value.

- **`guid`** modifies the `<guid>App GUID</guid>` value.

- **`appName`** modifies the `<name>App Name</name>` value.

	- **Note:** In Android, you may have an `<activity>` tag within the `<manifest>` with the property `android:name`. If that's the case, this will be updated too as long as this is the **first** `activity` tag inside `application`.

- **`version:format`** modifies the version of the app following a given format, the available values for formatting are:

	- **`major`** the current first value of the version (**1**.0.0).
	
	- **`minor`** the current second value of the version (1.**0**.0).

	- **`build`** the current third value of the version (1.0.**0**).

	- **Any digit(s)** will just copy them in the given spot of the version (e.g. Given version `1.0.0` and format `major.minor.3` will generate `1.0.3`).

	- **Functions**. Additional to the format, some function(s) could be applied with the caret character (`|`). This will generate first the value from the format, then apply the given functions from left to right. Supported functions so far:

		- **`bump`** Will add 1 to the number.

- **`properties`** will add/modify the `<property id="my-id"></property>` tag(s).
	
	- If the given id already exists in the tiapp.xml, it will replace it.

	- If the id does not exist, will create a new `property` tag.

	- Note this will **not** remove `property` tags at any time.
