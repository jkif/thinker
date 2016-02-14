'use strict';

import TruthTree from './truth_tree';
import NODE_REGISTRY from './node_registry';

export default class Thinker {

  constructor() {}

  validateJkif(candidate) {
    if (candidate) {
      return candidate.type in NODE_REGISTRY;
    }
  }

  think(jkif, options = {}) {
    let tree = jkif;

    if (!jkif || !this.validateJkif(jkif)) {
      throw new Error('Thinker.think needs jkif input. Try jkif-parser to parse into jkif.');
    }

    if (!TruthTree.isTruthTree(jkif)) {
      tree = new TruthTree(jkif, options);
    }

    return tree.isSatisfiable();
  }

}
