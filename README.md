# Autovance: Stripe Charge Fee API & email service.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

__*See below before pressing that juicy button.*__

Do you have trouble balancing your accounts because of discrepancies caused by the fee's collected by stripe? Well, here may lie the solution.

This small stand alone api built on restify can be run for free on heroku or a similar service, and uses node.js (/ io.js) to run. Dead simple to deploy, the service recieves charge notifications from stripe and stores the fee's associated with those charges in a redis store. It then collects them on a weekly schedule and sends them formatted as an email.

Here's how to set it up (i'll be using heroku as the example service):

__Press the button up above for a super easy setup. The only steps you need to take is #5 & #6__

1. Download / clone the repo to where ever you'd like.
2. Deploy the app to heroku. This requires a heroku account and an app set up in your dashboard, and the heroku toolbelt application installed.
3. Setup the environment variables on heroku under the application settings. A sample list is provided in `app.json`.
4. Install the __redis cloud__ addon. This allows the service to store transactions as it recieves them and serve them at a later date.
5. Add the __scheduler__ addon and set it to hit `node s-task` daily at a time of your choice.
6. Setup a Stripe webhook through their UI to send the app 'successful charge' events.
7. Scale the heroku web dyno's from 0 to 1 to start the app.
8. Enjoy!

If you have any troubles or questions, send me a ping [@forstermatth](http://www.twitter.com/forstermatth),
if you run into any bugs or have a feature request, open up an issue on this page (github)!

# Development / Testing

To run any tests / develop within this repo you need:
* [[`node.js or equivalent`](https://github.com/nodejs/io.js}] 
* [[`redis`](http://redis.io/download)]

Run `npm install`, `npm install mocha -g` and `mocha tests` to verify your environment.

Fork the repo, make pull requests and we will do our best to include your changes!
