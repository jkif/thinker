# Algorithm Design

## `Thinker.think`

##### Purpose: analyze sets of parsed SUO-KIF to determine consistency

Input: a parsed set of SUO-KIF sentences

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
  > Return TT.isConsistent()
---

TT.constructor(JKIF)
  > .trunk -> <Node>[] from JKIF.expressions

TT.isConsistent
  > TBD
```
