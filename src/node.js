'use strict';
import NODE_REGISTRY from './node_registry';

export default class Node {

  constructor(jkif) {
    this.proposition = Node.getProps(jkif);
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
        return jkif.variableList.concat(jkif.quantifiedSent);
        break;
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
      default:
        return [];
    }
  }
}
