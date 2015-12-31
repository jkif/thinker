'use strict';
import Node from './node';

export default class TruthTree {

  constructor(jkif, options) {
    this.open = {};
    this.closed = {};
    this.root = new Node(jkif);
  }

  static isTruthTree(candidate) {
    return candidate.__proto__.constructor === this;
  }

  isConsistent() {
    return false;
  }

}
