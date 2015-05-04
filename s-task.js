var request = require('request'),
  moment = require('moment');

var url = "https://autovance-fee-api.herokuapp.com/events/report?email=true";

if (moment().isoWeekday() === 7) {
  request(url, function(err, response, body){
    if (err) console.log(err);
    console.log(response.statusCode);
  });
} else {
  console.log('no request');
}
