# autovance fee api

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

__* See below before pressing that button *__

Do you have trouble balancing your accounts because of discrepancies caused by the fee's collected by stripe? Well, here may lie the solution.

This small stand alone api built on restify can be run for free on heroku or a similar service, and uses node.js (/ io.js) to run. Dead simple to deploy, the service recieves charge notifications from stripe and stores the fee's associated with those charges in a redis store. It then collects them on a weekly schedule and sends them formatted as an email.

Here's how to set it up (i'll be using heroku as the example service):

__ Press the button up above for a super easy setup. The only step you need to take is #5 __

1. Download / clone the repo to where ever you'd like.
2. Deploy the app to heroku. This requires a heroku account and an app set up in your dashboard, and the heroku toolbelt application installed.
3. Setup the environment variables on heroku under the application settings. A sample list is provided in `app.json`.
4. Install the __redis cloud__ application. This allows the service to store transactions as it recieves them and serve them at a later date.
5. Add the scheduler addon and set it to hit `node s-task` daily at a time of your choice.
6. Scale the heroku web dyno's from 0 to 1 to start the app.
7. Enjoy!


And all you have to do is set up the scheduled report afterwards!

