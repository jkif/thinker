'use strict';

import Branch from './branch';
import Node from './node';
import DERIVATION_REGISTRY from './derivation_registry'
import R from 'ramda';

export default class TruthTree {

  constructor(jkif, options = {}) {
    this.__jkif = jkif;
    this.LEVEL = this.LEVEL || 0;
    this.BRANCH_TACTUS = this.BRANCH_TACTUS || 0;
    this.NODE_TACTUS = this.NODE_TACTUS || 0;
    this.trunk = TruthTree.constructTrunk.call(this, jkif);
    this.branches = { live: [], dead: [] };
    if (this.trunk.length) {
      this.branches.live.push(new Branch(this.trunk, ++this.BRANCH_TACTUS));
    }
    this.options = options;
  }

  static constructTrunk(jkif) {
    return R.map((prop) => {
      return new Node(prop, ++this.NODE_TACTUS, ++this.LEVEL);
    }, Node.getProps(jkif));
  }

  static isTruthTree(candidate) {
    return candidate.__proto__.constructor === this;
  }

  addToAllLiveBranches(nodeOrNodes) {
    R.forEach(function(branch) {
      branch.nodes = branch.nodes.concat(nodeOrNodes);
    }.bind(this), this.branches.live);
  }

  static negatedNodes(nodes) {
    return R.filter(function(atomicNode) {
      return atomicNode.negated;
    }, nodes);
  }

  static atomicCompletedNodes(nodes) {
    return R.filter(function(node) {
      return node.atomic && node.completed;
    }, nodes);
  }

  static workingNodes(nodes) {
    return R.filter(function(node) {
      return !node.completed;
    }, nodes);
  }

  work(liveBranch) {
    // if branch has (atomic and completed) nodes, check if closed
    let atomicCompleted = TruthTree.atomicCompletedNodes(liveBranch.nodes);
    if (atomicCompleted.length) {
      // if atomicCompleted list has any negated nodes, check for contradiction
      if (TruthTree.negatedNodes(atomicCompleted).length) {
        // if contradiction found, close branch and manage tree
        // branch.live = false
      }
    }

    let _workingNodes = TruthTree.workingNodes(liveBranch.nodes);

    if (!_workingNodes.length) {
      liveBranch.decomposed = true;
      return;
    }

    // if branch is still live, decompose each node and repeat
    if (liveBranch.live) {
      var newNodes = [];

      R.forEach(function(node) {

        switch (node.type) {
          case 'ConjunctionNode':
            let derivationRule = { from: node.level, name: 'conjunctionDecomposition' };
            let conjuncts = R.map(function(conjunctNode) {
              return new Node(conjunctNode, ++this.NODE_TACTUS, ++this.LEVEL, derivationRule);
            }.bind(this), node.proposition);
            node.completed = true;
            newNodes = newNodes.concat(conjuncts);
            this.addToAllLiveBranches(newNodes);
            break;
          default:
            node.completed = true;
            return;
        }

      }.bind(this), _workingNodes);
    }
  }

  isSatisfiable() {
    this.thinking = true;

    if (this.LEVEL < 1) {
      return false;
    }

    if (R.type(this.options.timeout) === 'Number') {
      setTimeout(function() {
        this.thinking = false;
      }.bind(this), this.options.timeout);
    }

    for (let i = 0; i < this.branches.live.length; i++) {
      let branch = this.branches.live[i];

      while (!branch.decomposed && branch.live && this.thinking) {
        this.work(branch);
      }
    }

    this.thinking = false;

    return R.any(function(branch) {
      return branch.decomposed && branch.live;
    }.bind(this), this.branches.live);
  }

}
