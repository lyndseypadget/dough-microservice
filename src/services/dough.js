var randomstring = require("randomstring");
var moment = require('moment');

var doughMixtures = [];

module.exports.create = function() {
  var doughMixture = {
    beginTime: moment(),
    id: randomstring.generate()
  }
  doughMixtures.push(doughMixture);
  return doughMixture;
}

module.exports.mix = function (doughMixture, yeastMixture, flour, done) {
  //MOCK: Simulate flipping this switch, normally a job would do it
  doughMixture.hasRisen = true

  done(null, doughMixture);
}
