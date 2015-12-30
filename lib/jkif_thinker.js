;(function() {
  'use strict';

  var Thinker = {};

  // private methods
  function __store__() {}

  function validateJkif(jkif) {
    // return: throw if not jkif, else true
  }
  function jkifToTruthTree(jkif) {
    // return: <TruthTree>
  }
  function think(jkif) {
    // return: { isConsistent: Boolean, ?output: { TBD } }
  }

  // public methods
  Thinker.validateJkif = validateJkif;
  Thinker.jkifToForest = jkifToForest;
  Thinker.think = think;

  // expose module of correct type
  if (typeof exports === 'object') {
    module.exports = Thinker;
  } else if (typeof define === 'function' && define.amd) {
    define(function() { return Thinker; });
  } else {
    this.Thinker = Thinker;
  }
}.call(this));
