var async  = require('async');
var moment = require('moment');

function validateWaterTemp (water, done) {
  if(water.temp < 100) {
    done("Water is too cold!")
  }
  else if(water.temp > 110) {
    done("Water is too hot!")
  }
  done(null);
}

function validateSugarMeasurement (sugar, done) {
  if(sugar.teaspoons < 1) {
    done("Not enough sugar!")
  }
  done(null);
}

function validate (water, sugar, yeast, done) {

  if(yeast.type !== "activeDry")
    done("Unknown yeast type")

  async.series([
    function (cb) { validateWaterTemp(water, cb); },
    function (cb) { validateSugarMeasurement(sugar, cb); }
  ], function(err) {
    done(err, water, sugar);
  });
}

function stir(water, sugar, yeast, done) {
  let yeastMixture = {
    beginTime: moment()
  }

  //MOCK: Simulate flipping this switch, normally a job would do it
  yeastMixture.hasFrothyBubbles = true

  done(null, yeastMixture);
}

function inspectYeastMixture (yeastMixture, done) {
  if(!yeastMixture.hasFrothyBubbles) {
    return done("The Yeast is dead, Jim!");
  }
  done(null, yeastMixture);
}

//Returns a yeastMixture object
module.exports.createProof = function (water, sugar, yeast, done) {
  async.waterfall([
    function (cb) { validate(water, sugar, yeast, cb); },
    function (water, sugar, cb) { stir(water, sugar, yeast, cb); }
  ], done);
}

module.exports.testProof = function(yeastMixture, done) {
  let timeDiff = moment().diff(yeastMixture.beginTime, 'seconds')
  if(timeDiff < 6) {
    let minutesRemaining = 6 - timeDiff;
    return done(`Proof is not ready, wait approximately ${minutesRemaining} more minutes.`);
  }

  inspectYeastMixture(yeastMixture, done);
}
