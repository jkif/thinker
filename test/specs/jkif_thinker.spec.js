'use strict';

var chai = require('chai');
var Thinker = require('../../lib/jkif_thinker').default;
var Parser = require('jkif-parser');

chai.expect();

const expect = chai.expect;

var E = Parser.parse('(exists (?THING)(instance ?THING Entity))');
var A = Parser.parse('(forall (?THING)(instance ?THING Entity))');
var word = Parser.parse('Word');
var negWord = Parser.parse('(not RandomWord)');
var negRelSent = Parser.parse('(not (instance ?F Farmer))');
var negConjunction = Parser.parse('(not (and (instance ?F Farmer)(instance ?T Tractor)))');
var negDisjunction = Parser.parse('(not (or (instance ?F Farmer)(instance ?F Food)))');
var negImplication = Parser.parse('(not (=> (instance ?F Farmer)(instance ?F Abstract)))');
var negEquivalence = Parser.parse('(not (<=>(instance ?CLASS Class)(subclass ?CLASS Entity)))');
var negNegation = Parser.parse('(not (not RandomWord))');
var varNode = Parser.parse('?THING');
var relSent = Parser.parse('(instance ?F Farmer)');
var conj = Parser.parse('(and (instance ?F Farmer)(instance ?T Tractor)(likes ?F ?T))');
var disj = Parser.parse('(or (instance ?F Farmer)(instance ?F Food))');
var equiv = Parser.parse('(<=>(instance ?CLASS Class)(subclass ?CLASS Entity))');
var equation = Parser.parse('(= 1 2)');
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
var twoSentContra = Parser.parse('(not (?THING))(?THING)');
var word = Parser.parse('word');
var empty = Parser.parse('');
var target = Parser.parse('(instance ?FIDDLE Entity)');
var T = new Thinker();

var result = T.think(negConjunction);

console.log(result);



// console.log(target.expressions[0]);

// describe('.think', () => {

//   it('should throw if given empty input', () => {
//     var e;
//     try {
//       T.think();
//     } catch (err) {
//       e = err;
//     }
//     expect(e.message).to.equal('Thinker.think needs jkif input. Try jkif-parser to parse into jkif.');
//   });

//   it('should throw if given non-jkif input', () => {
//     var e;
//     try {
//       T.think({ type: 'NotRealNode' });
//     } catch (err) {
//       e = err;
//     }
//     expect(e.message).to.equal('Thinker.think needs jkif input. Try jkif-parser to parse into jkif.');
//   });

//   it('should return false if jkif input is empty', () => {
//     expect(T.think(empty)).to.be.false;
//   });

//   it('should return false if jkif input is inconsistent', () => {
//     expect(T.think(twoSentContra)).to.be.false;
//   });

//   it('should return true if jkif input is consistent', () => {
//     expect(T.think(relSent)).to.be.true;
//   });

// });
