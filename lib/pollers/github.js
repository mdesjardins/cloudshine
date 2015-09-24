// Github status checker

var FeedJett = require('feedjett');
var https = require('https');
var request = require('request');

exports.poll = function(callback) {
  console.log("ABOUT TO MAKE REQUEST");

  var feedjett = new FeedJett();
  var articles = [];

  request
    .get('https://status.github.com/messages.rss')
    .on('error', function(error) {
      console.log("Request error");
      console.log(error)
    })
    .on('response', function(res) {
      console.log('Request response');
      var stream = this;
      if (res.statusCode != 200) {
        return this.emit('error', new Error('Bad status code'));
      }
      stream.pipe(feedjett);
    });

  feedjett.on('readable', function() {
    var stream = this, item; 
    while (item = stream.read()) {
      articles.push(item);
    }
  });

  feedjett.on('end', function() {
    console.log("== Zeroth Article ===========================");
    console.log(articles[0]);
    match = /\[(.*?)]\s(.*)$/.exec(articles[0].title);
    up = match[1] == 'good' ? true : false;
    message = articles[0].description;
    result = { 'up': up, 'message': message };
    callback(result);
    console.log("=============================================");
  });
}

exports.name = 'github';
