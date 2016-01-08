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

#### 001

```shell
# To test if a kwb is satisfiable...
... find a model
  > model : open path
  > satisfiable : at least 1 open path (model)
  > unsatisfiable : no model

# Algorithm

> create Truth Tree from kwb

# kwb = [A, -B]

# TT.branches = [ Branch([Node(A), Node(-B)]) ]

# for each branch in TT.branches
  branch <- Branch([Node(A), Node(-B)])

  # is branch open?
    > [] <- collect .expanded Nodes from branch
    > does [] contain two contradictory nodes?
      > contradictory nodes <- same node symbol x 2, one is negated
    * yes:
      > continue to next step
    * no:
      > mark branch closed, skip next step

  # is branch decomposed?

```













<!--
traverse tree (breadth-first?) with subroutine
> recursive subroutine
> for each open branch, BRANCH, in TT
    BASECASE 1:
    > inspect BRANCH for closure
    > if BRANCH is closed
      > manage BRANCH, BREAK
  > for each node, NODE, in BRANCH
    > decompose NODE via expansion (one-level)
    > unify BRANCH if possible
    > continue to next node
    > inspect TT for closure
      > manage TT
  > assign truth values to tree
  > interpret tree in search for model
# expansion
> recursively, find main connective
> keep track of open/closed paths(branches)
> keep track of variables
> keep track of quantifiers
> main connective : negation <sub-rule> or <sub-rule>
# unification
# assign truth values to tree
# interpret tree
?? Propositional logic thinker first, then predicate logic?
?? Propositional and predicate logic delivered together?
-->