import TruthTree from './truth_tree';

export default class Thinker {
  constructor() {
    this._name = 'Thinker';
    this._tree = new TruthTree();
  }
  get name() {
    return this._name;
  }
}


// DRIVER CODE
console.log(new Thinker())