// Heroku status checker

var FeedJett = require('feedjett');
var https = require('https');
var request = require('request');

exports.poll = function(callback) {

  var feedjett = new FeedJett();
  var articles = [];

  request
    .get('https://status.heroku.com/feed')
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
    match = /^Resolved:.*$/.exec(articles[0].title);
    up = match == null ? false : true;
    message = up ? 'No known issues at this time.' : articles[0].title
    result = { 'up': up, 'message': message };
    callback(result);
    console.log("=============================================");
  });
}

exports.name = 'heroku';
