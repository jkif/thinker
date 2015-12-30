;(function() {
  'use strict';

  var Thinker = {};

  // private methods
  function __store__() {}

  function validateJkif(jkif) {}
  function jkifToForest(jkif) {}
  function isConsistent(jkif) {}

  // public methods
  Thinker.validateJkif = validateJkif;
  Thinker.jkifToForest = jkifToForest;
  Thinker.isConsistent = isConsistent;

  // expose module of correct type
  if (typeof exports === 'object') {
    module.exports = Thinker;
  } else if (typeof define === 'function' && define.amd) {
    define(function() { return Thinker; });
  } else {
    this.Thinker = Thinker;
  }
}.call(this));
