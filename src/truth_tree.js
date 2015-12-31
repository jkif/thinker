'use strict';

import Node from './node';
import R from 'ramda';

export default class TruthTree {

  constructor(jkif, options) {
    this.level = 0;
    this.STEP_TACTUS = 0;
    this.OPEN_STACK_TACTUS = 0;
    this.CLOSED_STACK_TACTUS = 0;
    this.open = {};
    this.closed = {};
    this.root = new Node(jkif, this.STEP_TACTUS);
    this.trunk = TruthTree.constructTrunk.call(this, jkif);
    if (this.trunk.length) {
      this.open[++this.OPEN_STACK_TACTUS] = R.clone(this.trunk);
    }
    if (this.level < 1) {
      this.root.decomposed = true;
    }
  }

  static constructTrunk(jkif) {
    return R.map((prop) => {
      return new Node(prop, ++this.STEP_TACTUS, ++this.level);
    }, Node.getProps(jkif));
  }

  static isTruthTree(candidate) {
    return candidate.__proto__.constructor === this;
  }

  static filterDecomposed(nodes) {
    return R.filter((node) => {
      return !!node.decomposed;
    }, nodes);
  }

  isConsistent() {
    if (this.level < 1) {
      return false;
    }

    // recursive subroutine
    // for each open stack
      // for each node in stack
        // decompose node via expansion (unify where possible)
        // inspect tree for closure
        // manage branches, *unify, apply heuristics, continue (iterate-recurse or recurse-iterate)
  }

}
