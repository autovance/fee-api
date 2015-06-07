# Stripe Fee API ChangeLog

## 2015-06-07, Version 1.1.0

### Notable changes

* **transactions**: Adds the TransactionList.delete() function to facilitate rolling deletes, and makes use of it in the report event.
* **email**: Adds the EMAIL_SENDER environment variable to allow for custom email origins
* **report-event**: Adds the DELETE_THRESHOLD environment variable to allow users to define how much history they want to keep.
* **scheduled-task**: Adds the SELF_URL environment variable to ensure the scheduled task hits its own service.

### Commits

* [[`3e38290c4b`](https://github.com/autovance/fee-api/commit/3e38290c4b)] - **transactions**: Introduce list.delete(), and a few env variables [#13](https://github.com/autovance/fee-api/pull/13)