# My Cloud Functions

These are used as the back end stuff for the frontend blogger site. 

Here are the three needed functions:
    * [email](functions/email/README.md)

<img src="https://avatars2.githubusercontent.com/u/2810941?v=3&s=96" alt="Google Cloud Platform logo" title="Google Cloud Platform" align="right" height="96" width="96"/>

# Google Cloud Functions - SendGrid sample

See:

* [Cloud Functions SendGrid tutorial][tutorial]
* [Cloud Functions SendGrid sample source code][code]

[tutorial]: https://cloud.google.com/functions/docs/tutorials/sendgrid
[code]: index.js

## Dependencies
 - NodeJS6

## Deploy and run the sample

See the [Cloud Functions SendGrid tutorial][tutorial].

## Run the tests

1. Read and follow the [prerequisites](../../#how-to-run-the-tests).

**notes:**

 * On Windows run this: `npm config set script-shell "C:\\Program Files\\Git\\bin\\bash.exe"`

1. Install dependencies:

        npm install

1. Run the tests:

        npm test

## Config 

Create a file called `config.json` with the following:

```json
{
  "EVENT_BUCKET": "[YOUR_EVENT_BUCKET_NAME]",
  "DATASET": "[YOUR_DATASET_NAME]",
  "TABLE": "events",
  "USERNAME": "[YOUR_USERNAME]",
  "PASSWORD": "[YOUR_PASSWORD]"
}
```

