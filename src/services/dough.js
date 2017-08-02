var async = require('async');
var moment = require('moment');
var yeastService = require("./yeast");

var doughMixtures = {}; //associative array
var doughMixtureCount = 0;

var flour = {selfRising: false}

function create(water, sugar, yeast, done) {
  var doughMixture = {
    beginTime: moment(),
    id: doughMixtureCount++,
    status: 'proofing'
  }

  yeastService.createProof(water, sugar, yeast, function(err, yeastMixture) {
    if(err) { return done(err); }
    if(yeastMixture) {
      doughMixture.yeastMixture = yeastMixture;
    }
    doughMixtures[doughMixture.id] = doughMixture;
    done(null, doughMixture);
  });
}

//Callback isn't actually needed, but it would be if we were using a database
function getById(id, done) {
  if(!(id in doughMixtures)) { return done("Dough not found"); }

  var doughMixture = doughMixtures[id];
  if(doughMixture.status === 'proofing') {
    yeastService.testProof(doughMixture.yeastMixture, function (err, yeastMixture) {
      if(err) { return done(err); }
      //update the status
      yeastMixture.endTime = moment()
      doughMixture.yeastMixture = yeastMixture
      doughMixture.status = 'proofed'
      doughMixtures[id] = doughMixture

      return done(null, doughMixture);
    });
  }
  else {
    done(null, doughMixture);
  }
}

function mix(doughMixture, flour, done) {
  doughMixture.flour = flour;
  doughMixture.status = 'mixed';
  doughMixture.riseBeginTime = moment();
  doughMixtures[doughMixture.id] = doughMixture;

  done(null, doughMixture);
}

function letRise(doughMixture, done) {

  let timeDiff = moment().diff(doughMixture.riseBeginTime, 'seconds') //TODO change to minutes
  if(timeDiff < 60) {
    let minutesRemaining = 60 - timeDiff;
    return done(`Dough is still rising, wait approximately ${minutesRemaining} more minutes.`, doughMixture);
  }
  else {
    doughMixture.riseEndTime = moment();
    doughMixture.status = 'risen';
    doughMixtures[doughMixture.id] = doughMixture;

    done(null, doughMixture);
  }
}

function spin(doughMixture, done) {
  doughMixture.status = 'thrown';
  doughMixtures[doughMixture.id] = doughMixture;
  done(null, doughMixture);
}

function proceedToNextStatus(doughMixture, newStatus, done) {
  //TODO here is where you'd do some old -> new status checks
  switch(newStatus) {
    case 'proofing':
      break;
    case 'mixed':
      mix(doughMixture, flour, done);
      break;
    case 'risen':
      letRise(doughMixture, done);
      break;
    case 'thrown':
      spin(doughMixture, done);
      break;
    default:
      done('Unrecognized status provided');
  }
}

function updateStatus(id, newStatus, done) {
  if(!newStatus) { return done("Status not provided"); }

  async.waterfall([
    function(cb) { getById(id, cb); },
    function(doughMixture, cb) {
      proceedToNextStatus(doughMixture, newStatus, cb); },
  ], done);
}

function deleteById(id, done) {
  if(!(id in doughMixtures)) {
    return done("Dough not found");
  }
  else {
    delete doughMixtures[id];
    done(null);
  }
}

module.exports = {
  create,
  getById,
  updateStatus,
  deleteById
}
