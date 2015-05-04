var request = require('request');

var url = "https://autovance-fee-api.herokuapp.com/events/report?email=true";
request(url, function(err, response, body){
  if (err) console.log(err);
  console.log(response.statusCode);
});