# Algorithm Design

## `Thinker.think`

##### Purpose: analyze sets of parsed SUO-KIF to determine consistency

Input: a parsed set of SUO-KIF sentences, timeout option

Output: a boolean value

- `sentence` -> formula
- `atom` -> not `sentence` -> string, number, word, variable

```
# Sentence Nodes #
RelSentNode           : (Px)
NegationNode          : (-Px)
ConjunctionNode       : (Px AND Rx)
DisjunctionNode       : (Px OR -Px)
ImplicationNode       : (IF Px THEN Rx)
EquivalenceNode       : (IFF Px THEN Rx)
EquationNode          : (Px EQUALS Rx)
UniversalSentNode     : (FORALL x, Px OR -Px)
ExistentialSentNode   : (EXISTS x, Px OR -Px)

# Atom Nodes #
WordNode              : (x)
VariableNode          : (?x), (@x)
StringLiteralNode     : (''), ("")
NumericLiteralNode    : (1), (0.1), (-1), (2e8)
```

### Algorithm

```
---
Thinker.think(JKIF)
  > Create TruthTree from JKIF -> TT
  > Return TT.isConsistent() / TT.isSatisfiable()?
---

TT.constructor(JKIF)
  > .trunk -> <Node>[] from JKIF.expressions

TT.isConsistent
  > TBD
```

#### Concrete Examples

```
# Target: (instance ?FIDDLE Entity)

Parsed (length: 1) -> KIFNode.expressions[0] -> RelSentNode

- RelSentNode:
  - instance (relation name)
  - ?FIDDLE (argument 1, variable)
  - Entity (argument 2, word)

  - I(fe) : Predicate I applies to f and e
```

#### Concrete Truth Tree Steps - VALIDITY - Propositional - NAIVE

1. create set of propositions, premises + negated conclusion
1. add annotations to each proposition
1. start at proposition 1, make true
1. check if branch closes
1. repeat steps 3-4 for the remaining propositions
1. evaluate tree
