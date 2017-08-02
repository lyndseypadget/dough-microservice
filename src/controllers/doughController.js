var async  = require('async');

var yeastService = require("../services/yeast");
var doughService = require("../services/dough");

exports.createDough = function(req, res) {

	var water = {temp: 100}
	var sugar = {teaspoons: 1}
	var yeast = {type: "activeDry"}
	var flour = {selfRising: false}

	var doughMixture = doughService.create();

	async.waterfall([
		function (cb) { yeastService.createProof(water, sugar, yeast, cb); },
		function (yeastMixture, cb) { yeastService.testProof(yeastMixture, cb); },
		function (yeastMixture, cb) { doughService.mix(doughMixture, yeastMixture, flour, cb); }
	], function(err) {
		console.log(err, doughMixture)
		if(err) {
			if(/Proof is not ready/i.test(err)) {
				return res.status(202).send(doughMixture);
			}
		}
		res.status(200).send(doughMixture);
	});
}
