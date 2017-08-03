var doughService = require("../services/dough");

var water = {temp: 100}
var sugar = {teaspoons: 1}
var yeast = {type: "activeDry"}

exports.createDough = function(req, res) {
	doughService.create(water, sugar, yeast, function(err, doughMixture) {
		if(err) { return res.status(500).send(err); }
		res.status(202).send(doughMixture);
	});
}

exports.retrieveDough = function(req, res) {
	doughService.getById(req.params.id, function(err, doughMixture) {
		if(err) {
			if(/Dough not found/i.test(err)) {
				return res.status(404).send(err);
			}
			else if(/Proof is not ready/i.test(err)) {
				return res.status(202).send(err);
			}
			else {
				return res.status(500).send(err);
			}
		}
		else {
			return res.send(doughMixture);
		}
	});
}

exports.updateDough = function(req, res) {
	if(!req.body) { return res.status(400).send("No body found"); }
	doughService.updateStatus(req.params.id, req.body.status, function(err, updatedDoughMixture) {
		if(err) {
			if(/Dough not found/i.test(err) || /Proof is not ready/i.test(err)) {
				return res.status(404).send(err);
			}
			else if(/Dough is still rising/i.test(err)) {
				return res.status(422).send(err);
			}
			else if(/Status not provided/i.test(err)) {
				return res.status(400).send(err);
			}
			else {
				return res.status(500).send(err);
			}
		}
		else {
			return res.status(200).send(updatedDoughMixture);
		}
	});
}

exports.deleteDough = function(req, res) {
	doughService.deleteById(req.params.id, function(err) {
		if(err) {
			if(/Dough not found/i.test(err)) {
				return res.status(404).send(err);
			}
			else {
				return res.status(500).send(err);
			}
		}
		else {
			return res.status(200).send();
		}
	});
}
