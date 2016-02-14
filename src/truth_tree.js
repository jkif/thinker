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

  addToAllBranches(nodeOrNodes, branches) {
    R.forEach(function(branch) {
      branch.nodes = branch.nodes.concat(nodeOrNodes);
    }, branches);
  }

  cloneAllLiveBranches() {
    return R.map(function(branch) {
      let clonedNodes = R.map(function(node) {
        return new Node(node, ++this.NODE_TACTUS);
      }.bind(this), branch.nodes);
      return new Branch(clonedNodes, ++this.BRANCH_TACTUS, branch.decomposed);
    }.bind(this), this.branches.live);
  }

  manageBranchingStacks(nodesToAdd) {
    let clonedBranches = this.cloneAllLiveBranches();
    this.addToAllBranches(nodesToAdd[0], this.branches.live);
    this.addToAllBranches(nodesToAdd[1], clonedBranches);
    this.branches.live = this.branches.live.concat(clonedBranches);
  }

  decomposeNode(node) {
    let derivationRule = { from: node.level };
    switch (node.type) {
      case 'ConjunctionNode':
        derivationRule.name = 'conjunctionDecomposition';
        let conjuncts = R.map(function(conjunctNode) {
          return new Node(conjunctNode, ++this.NODE_TACTUS, ++this.LEVEL, derivationRule);
        }.bind(this), node.proposition);
        node.completed = true;
        this.addToAllBranches(conjuncts, this.branches.live);
        break;
      case 'DisjunctionNode':
        derivationRule.name = 'disjunctionDecomposition';
        ++this.LEVEL;
        let disjuncts = R.map(function(disjunctNode) {
          return new Node(disjunctNode, ++this.NODE_TACTUS, this.LEVEL, derivationRule);
        }.bind(this), node.proposition);
        node.completed = true;
        this.manageBranchingStacks(disjuncts);
        break;
      default:
        node.completed = true;
        return;
    }
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
      R.forEach(this.decomposeNode.bind(this), _workingNodes);
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

      // console.log(branch);
      // console.log('before');
      while (!branch.decomposed && branch.live && this.thinking) {
        this.work(branch);
      }
      // console.log('after');
      // console.log(branch);
    }

    console.log(this)
    this.thinking = false;

    return R.any(function(branch) {
      return branch.decomposed && branch.live;
    }.bind(this), this.branches.live);
  }

}
