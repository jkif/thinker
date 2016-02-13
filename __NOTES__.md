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

```shell
# TruthTree
> .__jkif : <KIFNode>
> .LEVEL : Number (?0)
> .NODE_TACTUS : Number (?0)
> .trunk: .constructTrunk(.__jkif)
> .branches : { live: []<Branch>, dead: []<Branch> }

# Branch
> .nodes : []<Node>
> .live : Boolean (?true)

# Node
> .id : Number <NODE_TACTUS>
> .level : Number <TruthTree.LEVEL> (?0)
> .locationData : { <KIFNode>.locationData }
> .type : String from <NodeRegistry>
> .proposition : Node.getProps(self) -> []
> .decomposed : .type in <AtomRegistry> -> Boolean
> .negated : Boolean (?false)
> .derivation : { from: Number<derivation-level>, name: String<derivation-rule> }
  > Node.defaultDerivation() -> { from: null, name: 'initialSentence' }

```





















<!-- ### Algorithm

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
> To test if a kwb is satisfiable...
... find a model
  > model : open path
  > satisfiable : at least 1 open path (model)
  > unsatisfiable : no model

# Algorithm

0. create Truth Tree from kwb

- kwb = [A, -B]

- TT.branches = [ Branch([Node(A), Node(-B)]) ]

1. for each branch in TT.branches
  branch <- Branch([Node(A), Node(-B)])

  1.1. is branch closed?
    > [] <- collect .atomic Nodes from branch
    > does [] contain two contradictory (.atomic) nodes?
      > contradictory (.atomic) nodes <- same node symbol x 2, one is negated
    * yes:
      1.1.1. mark branch .closed, skip 1.2
    * no:
      1.1.2. continue to 1.2

  - branch.decomposed is a computed property
    > traverse all nodes in branch
      > .completed node(s).atomic flags

  1.2. is branch decomposed (and .closed is false)?
    > check branch.decomposed boolean flag
    * yes:
      1.2.1.
    * no:
      1.2.2. ?

``` -->

<!--
traverse tree
> for each branch, BRANCH, in TT
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