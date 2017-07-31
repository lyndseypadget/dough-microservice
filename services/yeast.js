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

function validate (water, sugar, done) {
  async.series([
    function (cb) { validateWaterTemp(water, cb); },
    function (cb) { validateSugarMeasurement(sugar, cb); }
  ], function(err) {
    done(err, water, sugar);
  });
}

function stir(water, sugar, yeast, done) {
  let yeastMixture = {
    beginTime: moment.now()
  }

  //MOCK: Simulate flipping this switch, normally a job would do it
  yeastMixture.hasFrothyBubbles = true

  done(null, yeastMixture);
}

function inspectYeastMixture (yeastMixture, done) {
  if(!yeastMixture.hasFrothyBubbles) {
    done("The Yeast is dead, Jim!");
  }
  done(null);
}

exports.type = "activeDry"

exports.createProof = function (water, sugar, yeast, done) {
  async.waterfall([
    function (cb) { validate(water, sugar, cb); },
    function (water, sugar, cb) { stir(water, sugar, yeast, cb); }
  ], function(err) {
    done(err, water, sugar);
  });
}

exports.testProof = function(yeastMixture, done) {
  let timeDiff = moment.now().diff(yeastMixture.beginTime, 'minutes')
  if(timeDiff < 6) {
    let minutesRemaining = 6 - timeDiff;
    done(`Proof is not ready, wait approximately ${minutesRemaining} more minutes.`);
  }

  inspectYeastMixture(yeastMixture, done);
}
