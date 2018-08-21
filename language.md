## Syntax and Semantics

### Patterns Parse Values

Values are particular values of a known number of bits, denoted (or parsed)
by a certain input representation.

More generally, `ValueName = ValueFormat.ValueLiteral`.  Value names are not
types, or part of a type system that gets checked for consistency, other than
holding a certain quantity of bits, or information capacity/channel width.

Built-in `ValueFormat`s, or literal `pat`terns (simple regexes) include:

    bin = pat.(0|1)+
    dec = pat.[1-9]?[0-9]+

... or `ValueFormat = pat.RegularExpression`.  Here are two built-in Values:

    bit = bin.0
    u32 = bin.00000000000000000000000000000000
    Magic_constantVal = dec.430981755332426 (fits in smallest power of 2 size bits)

It is an error to redefine a name to a new value in the same scope

### Values are Bound to Names

Names are memory slots in the body of a routine. Locals are declared
by their initialization to a value, either a `ValueFormat.ValueLiteral` or to
another named value.  In this way, named values are a special kind of local,
but if they are declared in the outermost scope of a module or program, they
act as global "types".



### Dots and Access

Dot syntax ( `foo.bar` ) is used for three operations, in this order of
precedence to avoid ambiguity:

1. Field access (Destructuring)
2. Casting
3. Format parsing in declaration initializations

### Structures and Data

Structures are aggregates of data of certain sizes or shapes, surrounded by
square brackets. For instance,

    foo = [ First.u32, Second.u32, Last.u64 ]
    bar = [ 32 x u32 ]
    b64 = [ 64 x bit ]

`FieldName.ValueName`

### Types and Casts

There are no "user types" or other type names, only bound names used as casts
(structure interpretations), as in:

    baz = u64
    baz = [ foo.Second, foo.First ]
    baz = [ foo.Second, foo.First ].u64

Truncation (demotion) and promotion invisibly occurs (without runtime checks,
but with possible compile-time warnings) when sizes don't match.

### Values and Refs

Values and refs are similar to C values and refs, including that you can do
pointer arithmetic with references.

    moo = bar.&

Moo now holds the address of the bar structure, where it is on the stack. In
this iteration of the language, all structs live on the stack and do not
outlive the routines in which they are allocated.

    baz = moo^

This dereferences moo and copies the referenced bar into baz. 

### Routines and Arguments

Routines can be bound to names, or remain anonymous bound into slots. They
are declared with a struct for their arguments and a sequence of statements.
If one of the arguments is named "out," the routine can bind a value or 
structure to it before returning.

    compute_function[ boop.u32, beep.f64, func2ptr.ref, out.u64 ] = {
      out = boop + beep.u64
    }

As a happy consequence of the unified binding and type namespaces, and as a
shorthand when there is only one value of a given type in an argument list,
you can use an afore-mentioned name to imply both the type and bound name.

Routines are invoked in expressions with arguments in a suffix parenthetical:

    bear = compute_function(beep, boop)

Routines retrieved from fields can also be invoked, as with any expression.

    bear = func2ptr


# FUTURE UNICORN STUFF XXX DISREGARD DISREGARD DISREGARD

### Macros Define Expansions of Wrappers

Macros are definitions with parentheses on the left-hand-side. Parentheses
surround parameter names, whose arguments are expanded into the wrapper body
defined in the right-hand-side.  `MacroName(param, ...) = Wrapper`. The macro
body wraps its arguments in several ways, as shown:

    Macro1(param1, param2) = ...

## TODO: define the syntaxes and semantics of the various kinds of macros, unifying notions of multi-stage computation (staging, or talking about more than one phase of compilation unit at once), quotation/quasiquotation, AST manipulation