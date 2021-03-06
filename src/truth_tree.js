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

  isSatisfiable() {
    if (this.LEVEL < 1) {
      return false;
    }
    this.thinking = true;
    this.setTimer();
    this.createTableaux();
    return this.evaluateTableaux();
  }

  createTableaux() {
    for (let i = 0; i < this.branches.live.length; i++) {
      let branch = this.branches.live[i];
      if (!this.thinking) {
        throw 'Timeout option made Thinker exit before reaching a conclusion';
      }
      while (!branch.decomposed && branch.live && this.thinking) {
        this.createTableau(branch);
      }
    }
  }

  evaluateTableaux() {
    return R.any(branch => {
      return branch.decomposed && branch.live;
    }, this.branches.live);
  }

  setTimer() {
    if (R.type(this.options.timeout) === 'Number') {
      setTimeout(_ => {
        this.thinking = false;
      }, this.options.timeout);
    }
  }

  createTableau(liveBranch) {
    let atomicCompleted = TruthTree.atomicCompletedNodes(liveBranch.nodes);
    if (atomicCompleted.length) {
      if (TruthTree.negatedNodes(atomicCompleted).length) {
        this.findContradiction(liveBranch, atomicCompleted);
      }
    }
    let _workingNodes = this.reduceBranch(liveBranch);
    if (liveBranch.live && !liveBranch.decomposed) {
      this.decomposeBranch(_workingNodes);
    }
  }

  findContradiction(branch, nodes) {
    if (nodes.length < 2) {
      return; // can't find a contradiction if there is only one proposition
    }
    // if contradiction found, close branch and manage tree
    // branch.live = false
  }

  reduceBranch(liveBranch) {
    let nodes = TruthTree.workingNodes(liveBranch.nodes);
    if (!nodes.length) {
      liveBranch.decomposed = true;
    }
    return nodes;
  }

  decomposeBranch(branchNodes) {
    R.forEach(this.decomposeNode.bind(this), branchNodes);
  }

  decomposeNode(node) {
    switch (node.type) {
      case 'ConjunctionNode':
        node.completed = true;
        this.addToAllBranches(this.createConjuncts(node), this.branches.live);
        break;
      case 'DisjunctionNode':
        node.completed = true;
        this.manageBranchingBranches(this.createDisjuncts(node));
        break;
      case 'ImplicationNode':
        node.completed = true;
        this.manageBranchingBranches(this.createImplication(node));
        break;
      // case 'EquationNode':
        // CURRENTLY being treated as semantic whole until shift to predicate logic
        // the two terms in node.proposition have to have the exact same (reference/resolution) data
        // node.completed = true;
        // break;
      case 'EquivalenceNode':
        node.completed = true;
        this.manageBranchingDoubleBranches(this.createEquivalence(node));
        break;
      case 'NegationNode':
        node.completed = true;
        let [decompositionType, negationNodes] = this.createNegation(node);
        if (decompositionType === 'stack') {
          // atomic, disjunction, implication, negation
          this.addToAllBranches(negationNodes, this.branches.live);
        } else if (decompositionType === 'branch') {
          // conjunction
        } else if (decompositionType === 'branch-stacks') {
          // equivalence
        }
        break;
      default:
        node.completed = true;
        return;
    }
  }

  addToAllBranches(nodeOrNodes, branches) {
    R.forEach(branch => {
      branch.nodes = branch.nodes.concat(nodeOrNodes);
    }, branches);
  }

  cloneAllLiveBranches() {
    return R.map(branch => {
      let clonedNodes = R.map(node => {
        return new Node(node, ++this.NODE_TACTUS);
      }, branch.nodes);
      return new Branch(clonedNodes, ++this.BRANCH_TACTUS, branch.decomposed);
    }, this.branches.live);
  }

  manageBranchingBranches(nodesToAdd) {
    let clonedBranches = this.cloneAllLiveBranches();
    this.addToAllBranches(nodesToAdd[0], this.branches.live);
    this.addToAllBranches(nodesToAdd[1], clonedBranches);
    this.branches.live = this.branches.live.concat(clonedBranches);
  }

  manageBranchingDoubleBranches(branches) {
    let clonedBranches = this.cloneAllLiveBranches();
    this.addToAllBranches(branches[0], this.branches.live);
    R.forEach(node => {
      this.addToAllBranches(node, clonedBranches);
    }, branches[1]);
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

  createEquivalenceNode(level, expression) {
    let derivationRule = { from: level, name: 'equivalenceDecomposition' };
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

  createEquivalence(node) {
    ++this.LEVEL;
    let firstLevel = [
      this.createEquivalenceNode(node.level, node.proposition[0]),
      this.createEquivalenceNode(node.level, node.proposition[1])
    ];
    ++this.LEVEL;
    let secondLevel = [
      this.createEquivalenceNode(node.level, node.proposition[0]),
      this.createEquivalenceNode(node.level, node.proposition[1])
    ];
    let leftBranch = [firstLevel[0], secondLevel[0]];
    let rightBranch = [firstLevel[1], secondLevel[1]];
    R.map(node => {
      node.negated = true;
      return node;
    }, rightBranch);
    return [leftBranch, rightBranch];
  }

  createNegation(node) {
    let [negatedSentence] = node.proposition;
    let derivationRule = { from: node.level };
    switch (negatedSentence.type) {
      default:
        derivationRule.name = 'negatedAtomDecomposition';
        let negated = new Node(negatedSentence, ++this.NODE_TACTUS, ++this.LEVEL, derivationRule);
        negated.negated = true;
        negated.completed = true;
        return ['stack', negated];
    }
  }

  static constructTrunk(jkif) {
    return R.map(prop => {
      return new Node(prop, ++this.NODE_TACTUS, ++this.LEVEL);
    }, Node.getProps(jkif));
  }

  static isTruthTree(candidate) {
    return candidate.__proto__.constructor === this;
  }

  static negatedNodes(nodes) {
    return R.filter(atomicNode => {
      return atomicNode.negated;
    }, nodes);
  }

  static atomicCompletedNodes(nodes) {
    return R.filter(node => {
      return node.atomic && node.completed;
    }, nodes);
  }

  static workingNodes(nodes) {
    return R.filter(node => {
      return !node.completed;
    }, nodes);
  }

}
