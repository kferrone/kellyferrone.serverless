
const SendGridAPI = require('./lib/SendGridAPI');
const functions = require('firebase-functions');
const Sitemap = require('./lib/Sitemap');
const cors = require('cors');
const config  = functions.config().app;

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase! The email in the config is " + config.sendGrid.email);
});

/**
 * Get the sitemap.xml
 */
exports.siteMap = functions.https.onRequest((req, res) => {
    console.log('Making the sitemap');
    var corsFn = cors();
    corsFn(req, res, function() {
        Sitemap.getSitemap(req,res);
    });
});

/**
 * Send an email
 */
exports.sendgridEmail = functions.https.onRequest((req, res) => {
    var corsFn = cors();
    corsFn(req, res, function() {
        SendGridAPI.sendgridEmailFn(req,res);
    });
});

/**
 * Handle sendgrids webhook
 */
exports.sendgridWebhook = functions.https.onRequest((req, res) => {
    var corsFn = cors();
    corsFn(req, res, function() {
        SendGridAPI.sendgridWebhook(req,res);
    });
});
