'use strict';

import R from 'ramda';

export default class Branch {

  constructor(nodes = [], id = 0) {
    this.id = id;
    this.nodes = nodes;
    this.live = this.nodes.length > 0;
    this.decomposed = false;
  }

}
