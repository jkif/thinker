import TruthTree from './truth_tree';
import NODE_REGISTRY from './node_registry';

export default class Thinker {

  constructor() {}

  validateJkif(candidate) {
    if (candidate) {
      return candidate.type in NODE_REGISTRY;
    }
  }

  think(jkif) {

    if (!jkif || !this.validateJkif(jkif)) {
      throw new Error('can only think with jkif input');
    }

    // check if tree
    // if not tree, convert to tree
    // return tree.isConsistent(thinkOptions)
  }

}
