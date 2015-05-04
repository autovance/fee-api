var request = require('request');

var url = "http://127.0.0.1:" + (process.env.PORT || 3000) + '/events/report?email=true';
request(url, function(err, response, body){
  if (err) console.log(err);
  console.log(response.statusCode);
});