'use strict';

import NODE_REGISTRY from './node_registry';
import ATOM_REGISTRY from './atom_registry';
import R from 'ramda';

export default class Node {

  constructor(jkif, id, level, derivation) {
    this.id = id;
    this.type = jkif.type;
    this.level = level || 0;
    this.locationData = jkif.locationData;
    this.decomposed = this.type in ATOM_REGISTRY;
    this.proposition = Node.getProps(jkif);
    this.derivation = derivation || Node.defaultDerivation();
    this.negated = this.derivation.name === 'negatedDecomposition';
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
