var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var env = require('node-env-file');
env('./.env');

/* Route Imports */
var apiController = require('./src/controllers/apiController');
var doughController = require('./src/controllers/doughController');

var allowCORS = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Authorization,Accept');

  if (req.method === 'OPTIONS') {
      res.send(200);
  } else {
      next();
  }
};
app.use(allowCORS);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//-----------------------------------------------
//Routes
//-----------------------------------------------
//TODO some routes would have auth middleware
app.get('/', apiController.getInfo);
app.post('/dough', doughController.createDough);
app.get('/dough/:id', doughController.retrieveDough);
app.patch('/dough/:id', doughController.updateDough);
app.delete('/dough/:id', doughController.deleteDough);
//-----------------------------------------------

server.listen(process.env.PORT, function() {
  console.log('Server listening on port:' + this.address().port);
});
