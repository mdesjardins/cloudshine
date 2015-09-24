var services = new Array();
var config = require('./config');
config.enabledPlugins().forEach(function(plugin) {
  services.push(require('./pollers/' + plugin));
});
var pollingRate = config.pollingRate();

var statuses = {};

process.on('message', function(app) {
  var i = 0;
  console.log('Enabled plugins ' + config.enabledPlugins());

  setInterval(function() {
    i++;
    index = i % services.length;
    service = services[index];
    console.log('Polling - checking ' + service.name);
    service.poll(function(result) {
      console.log(">>> RESULT: " + result.up + " ... " + result.message);
      statuses[service.name] = {service: service.name, result: result};
      process.send(statuses);
    });

  }, pollingRate);
});
