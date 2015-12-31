'use strict';

import Node from './node';
import R from 'ramda';

export default class TruthTree {

  constructor(jkif, options) {
    this.level = 0;
    this.open = {};
    this.closed = {};
    this.root = new Node(jkif);
    this.trunk = TruthTree.constructTrunk.call(this, jkif);
    if (this.level < 1) {
      this.root.decomposed = true;
    }
  }

  static constructTrunk(jkif) {
    return R.map((prop) => {
      return new Node(prop, ++this.level);
    }, Node.getProps(jkif));
  }

  static isTruthTree(candidate) {
    return candidate.__proto__.constructor === this;
  }

  isConsistent() {
    if (this.level < 1) {
      return false;
    }
    console.log(this.trunk);
  }

}
