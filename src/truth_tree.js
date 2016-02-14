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

  createConjunctionNode(level, conjunct) {
    let derivationRule = { from: level, name: 'conjunctionDecomposition' };
    return new Node(conjunct, ++this.NODE_TACTUS, ++this.LEVEL, derivationRule);
  }

  createDisjunctionNode(level, disjunct) {
    let derivationRule = { from: level, name: 'disjunctionDecomposition' };
    return new Node(disjunct, ++this.NODE_TACTUS, this.LEVEL, derivationRule);
  }

  createImplicationNode(level, expression) {
    let derivationRule = { from: level, name: 'implicationDecomposition' };
    return new Node(expression, ++this.NODE_TACTUS, this.LEVEL, derivationRule);
  }

  createConjuncts(node) {
    return R.map(this.createConjunctionNode.bind(this, node.level), node.proposition);
  }

  createDisjuncts(node) {
    ++this.LEVEL;
    return R.map(this.createDisjunctionNode.bind(this, node.level), node.proposition);
  }

  createImplication(node) {
    ++this.LEVEL;
    let _nodes = R.map(this.createImplicationNode.bind(this, node.level), node.proposition);
    _nodes[0].negated = true;
    return _nodes;
  }

  decomposeNode(node) {
    switch (node.type) {
      case 'ConjunctionNode':
        node.completed = true;
        this.addToAllBranches(this.createConjuncts(node), this.branches.live);
        break;
      case 'DisjunctionNode':
        node.completed = true;
        this.manageBranchingStacks(this.createDisjuncts(node));
        break;
      case 'ImplicationNode':
        node.completed = true;
        this.manageBranchingStacks(this.createImplication(node));
      default:
        node.completed = true;
        return;
    }
  }

  work(liveBranch) {
    let atomicCompleted = TruthTree.atomicCompletedNodes(liveBranch.nodes);
    if (atomicCompleted.length) {
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

      if (!this.thinking) {
        throw 'Timeout option made Thinker exit before reaching a conclusion';
      }

      while (!branch.decomposed && branch.live && this.thinking) {
        this.work(branch);
      }
    }

    return R.any(function(branch) {
      return branch.decomposed && branch.live;
    }.bind(this), this.branches.live);
  }

}
