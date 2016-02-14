'use strict';

import NODE_REGISTRY from './node_registry';
import ATOM_REGISTRY from './atom_registry';
import DERIVATION_REGISTRY from './derivation_registry';
import R from 'ramda';

export default class Node {

  constructor(jkif, id, level = 0, derivation = Node.defaultDerivation()) {
    this.id = id;
    if (Node.isNode(jkif)) {
      this.level = jkif.level;
      this.locationData = jkif.locationData;
      this.type = jkif.type;
      this.proposition = jkif.proposition;
      this.atomic = jkif.atomic;
      this.completed = jkif.completed;
      this.derivation = jkif.derivation;
      this.negated = jkif.negated;
    } else {
      this.level = level;
      this.locationData = jkif.locationData;
      this.type = jkif.type;
      this.proposition = Node.getProps(jkif);
      this.atomic = this.type in ATOM_REGISTRY;
      this.completed = false;
      this.derivation = derivation;
      this.negated = this.derivation.name in DERIVATION_REGISTRY.negations;
    }
  }

  static isNode(candidate) {
    return candidate.__proto__.constructor === Node;
  }

  static defaultDerivation() {
    return { from: null, name: 'initialSentence' };
  }

  static getProps(jkif) {
    switch (jkif.type) {
      case 'KIFNode':
      case 'EquivalenceNode':
        return jkif.expressions;
        break;
      case 'ConjunctionNode':
        return jkif.conjuncts;
        break;
      case 'DisjunctionNode':
        return jkif.disjuncts;
        break;
      case 'EquationNode':
        return jkif.terms;
        break;
      case 'UniversalSentNode':
      case 'ExistentialSentNode':
        return jkif.variableList.concat(jkif.quantifiedSent);
        break;
      case 'ImplicationNode':
        return [].concat(jkif.antecedent, jkif.consequent);
        break;
      case 'NegationNode':
        return [].concat(jkif.negatedExpression);
        break;
      case 'RelSentNode':
        return jkif.argumentList.concat(jkif.constant);
        break;
      case 'VariableNode':
        return [jkif.variableName];
        break;
      case 'WordNode':
        return [jkif.word];
        break;
      default:
        return [];
    }
  }
}
