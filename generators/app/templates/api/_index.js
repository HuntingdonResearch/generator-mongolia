let _ = require('lodash');
let express = require('express');
let bodyParser = require('body-parser');

let config = require('<%= projectName %>-api-config');
let routes = require('<%= projectName %>-api-routes');

let app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use('/', routes);

app.listen(process.env.PORT || config.port);

module.exports = app;
