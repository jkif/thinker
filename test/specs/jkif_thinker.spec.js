var chai = require('chai');
var Thinker = require('../../lib/jkif_thinker.js').default;

chai.expect();

const expect = chai.expect;

var lib;

describe('Given an instance of my Thinker', function () {
  before(function () {
    lib = new Thinker();
  });
  describe('when I need the name', function () {
    it('should return the name', () => {
      expect(lib.name).to.be.equal('Thinker');
    });
  });
});
