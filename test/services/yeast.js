var assert = require('assert');
var moment = require('moment');
var yeastService = require('../../src/services/yeast');

describe('Proof', function() {

  let now = moment();

  it('should return an error if you haven\'t waited long enough', function(done) {
    let yeastMixture = {
      beginTime: now.clone().subtract(3, 'seconds')
    };
    yeastService.testProof(yeastMixture, function(err) {
      assert.ok(err);
      assert.ok(/Proof is not ready/i.test(err));
      done();
    });
  });

  it('should NOT return an error if you have waited long enough', function(done) {
    let yeastMixture = {
      beginTime: now.clone().subtract(7, 'seconds')
    };
    yeastService.testProof(yeastMixture, function(err, updatedYeastMixture) {
      assert.ifError(err);
      assert.ok(updatedYeastMixture.endTime);
      assert.ok(updatedYeastMixture.hasFrothyBubbles);
      done();
    });
  });
});
