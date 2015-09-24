var appDataPath;
var pluginFiles = new Array();
var fs = require('fs');
var Configstore = require('configstore');
var configStore = new Configstore('com.cereslogic.cloudshine', {enabledPlugins: ['github','heroku'], pollingRate: 10000} );

exports.init = function(anAppDataPath) {
  appDataPath = anAppDataPath;
  console.log("Initializing configuration, reading from " + appDataPath);
  files = fs.readdirSync('./lib/pollers');
  files.forEach(function(file) {
    if (/js$/.test(file)) {
      pluginFiles.push(file.replace(/\.js$/,''));
    }
  });
}

exports.availablePlugins = function() {
  return pluginFiles;
}

exports.enabledPlugins = function() {
  return configStore.get('enabledPlugins');
}

exports.pollingRate = function() {
  return configStore.get('pollingRate');
}
