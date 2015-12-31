'use strict';

var chai = require('chai');
var Thinker = require('../../lib/jkif_thinker').default;
var Parser = require('jkif-parser');

chai.expect();

const expect = chai.expect;

var E = Parser.parse('(exists (?THING)(instance ?THING Entity))');
var A = Parser.parse('(forall (?THING)(instance ?THING Entity))');
var neg = Parser.parse('(not (?THING))');
var varNode = Parser.parse('?THING');
var relSent = Parser.parse('(intance ?F Farmer)');
var conj = Parser.parse('(and (instance ?F Farmer)(instance ?T Tractor)(likes ?F ?T))');
var disj = Parser.parse('(or (instance ?F Farmer)(instance ?F Food))');
var equiv = Parser.parse('(<=>(instance ?CLASS Class)(subclass ?CLASS Entity))');
var impl = Parser.parse(
  '(=> \
    (and \
      (playsRoleInEvent ?OBJ ?ROLE ?EVENT) \
      (instance ?EVENT ?CLASS) \
      (subclass ?CLASS Process) \
      (time ?EVENT ?TIME) \
      (eventLocated ?EVENT ?PLACE)) \
    (playsRoleInEventOfType ?OBJ ?ROLE ?CLASS ?TIME ?PLACE))'
);

var T = new Thinker();

describe('.think', () => {
  it('should throw if given empty input', () => {
    var e;
    try {
      T.think();
    } catch (err) {
      e = err;
    }
    expect(e.message).to.equal('Thinker.think needs jkif input. Try jkif-parser to parse into jkif.');
  });
  it('should throw if given non-jkif input', () => {
    var e;
    try {
      T.think({ type: 'NotRealNode' });
    } catch (err) {
      e = err;
    }
    expect(e.message).to.equal('Thinker.think needs jkif input. Try jkif-parser to parse into jkif.');
  });
});

// driver code
T.think(relSent);
