var menubar = require('menubar');
var poller = require('./lib/poller');
var config = require('./lib/config');
var childProcess = require('child_process');
var request = require('request');
var ipc = require('ipc');
var mb = menubar({preloadWindow: true});

mb.on('ready', function() {
  config.init(mb.app.getDataPath());
  pluginFiles = config.availablePlugins();
  console.log("AVAILABLE PLUGINS ARE " + pluginFiles);

  enabledPlugins = config.enabledPlugins();
  console.log("ENABLED PLUGINS ARE " + enabledPlugins);

  var child = childProcess.fork(__dirname + '/lib/poller.js');
  child.on('message', function(m) {
    console.log('PARENT got message:', m);
    mb.window.webContents.send('statuses-updated', m);
  });
  child.send(mb.app);
})
