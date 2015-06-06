// Used to trigger the email report on a weekly basis.
// _todo_ make it easy to change the frequency / day that the email is sent

var request = require('request'),
  moment = require('moment');

var url = "https://autovance-fee-api.herokuapp.com/events/report?email=true";

if (moment().isoWeekday() === 7) {
  request({
      url: url,
      headers: {
        apikey: process.env.API_SECRET
      }
    },
    function(err, response, body){
      if (err) console.log(err);
      console.log(response.statusCode);
    }
  );
} else {
  console.log('no request');
}
