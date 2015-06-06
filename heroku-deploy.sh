#!/bin/sh -e
APP_NAME=$1

echo "~~~~~~~~~~~ HEROKU DEPLOYMENT SCRIPT ~~~~~~~~~~~~~~~~"

echo "--- Fetching Current Heroku Environment: "
git remote add heroku git@heroku.com:$APP_NAME.git
git fetch heroku

echo "--- Comparing Database Changes: "
MIGRATION_CHANGES=$(git diff HEAD heroku/master --name-only -- migrations | wc -l)
echo "--- $MIGRATION_CHANGES Database migrations."

# PREV_WORKERS=$(heroku ps --app $APP_NAME | grep "^worker." | wc -l | tr -d ' ')

# migrations require downtime so enter maintenance mode
if test $MIGRATION_CHANGES -gt 0; then

  echo "--- Turning Maintenance on: "
  heroku maintenance:on --app $APP_NAME

  # Make sure workers are not running during a migration
  # heroku scale worker=0 --app $APP_NAME
fi

# deploy code changes (and implicitly restart the app and any running workers)

echo "--- (Force) Pushing Circle Environment to Heroku: "
git push -f heroku $CIRCLE_SHA1:refs/heads/master

# run database migrations if needed and restart background workers once finished
if test $MIGRATION_CHANGES -gt 0; then
  echo "--- Running Database Migrations: "
  heroku run ./node_modules/db-migrate/bin/db-migrate up --app $APP_NAME
# heroku scale worker=$PREV_WORKERS --app $APP_NAME

  echo "--- Restarting App: "
  heroku restart --app $APP_NAME
fi

echo "--- Turning maintenance off: "
heroku maintenance:off --app $APP_NAME
