import * as express from "express";

const app = express();
// https://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

app.get("/meta",function getMeta(req, res) {
   res.status(200).send('You have requested the meta data of the blog');
});

exports.app = app;