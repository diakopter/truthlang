Syntax and Semantics

Constants and Primitives

Constants are particular values of a known number of bits, denoted (or parsed)
by a certain input representation, such as:

bit = bin.0 (builtin)
u32 = bin.00000000000000000000000000000000 (builtin)
Magic_constantVal = dec.430981755332426 (fits in smallest power of 2 size bits)

Structures and Data

Structures are aggregates of data of certain sizes & shapes. For instance,

foo = { First = u32, Second = u32, Last = u64 }
bar = [ 32 * u32 ]
b64 = [ 64 * bit ]

Names and Bindings

There is no special binding declaration syntax, only an initialization value
to the first use of a name.

Types and Casts

There are no "user types" or other type names, only bound names used as casts
(structure interpretations), as in:

baz = u64
baz = { foo.Second, foo.First }
baz = { foo.Second, foo.First }.u64

Truncation (demotion) and promotion invisibly occurs (without runtime checks,
but with possible compile-time warnings) when sizes don't match.

Dots and Access

Dot syntax (foo.bar) is used for three notions, in this order of precedence
to avoid ambiguity:

1. Pointer chasing (Dereferencing)
2. Field access (Destructuring)
3. Casting

Values and Refs

Values and refs are similar to C values and refs, except you can't do pointer
arithmetic with references; you can only bind them to names/slots that can be
dereferenced. This is the only type-checking "rule" enforced at compile-time.

moo = bar.ref

Moo now holds a reference to the bar structure. The compiler/runtime is free
to allocate this from the heap or stack or wherever, and garbage collect it,
move it, or optimize it however it chooses. If bar was originally declared
in a routine, bar (and any references it holds) can outlive the routine.

baz = moo.bar

This dereferences moo and copies the referenced bar into baz. 

Routines and Closures

Routines can be bound to names, or remain anonymous bound into slots. They
are declared with a struct for their arguments and a sequence of statements.
If one of the arguments is named "out," the routine can bind a value or 
structure to it before returning.

compute_function = { boop.u32, beep.f64, func2ptr.ref, out = u64 }
  out = boop + beep.u64

As a happy consequence of the unionized binding and type namespaces, and as a
shorthand when there is only one value of a given type in an argument list,
you can use an afore-mentioned name to imply both the type and bound name.

Routines declared inside routines can bind to names in outer lexical scopes,
creating a closure each time the statement binding the inner routine is run.

Routines are invoked in expressions with arguments in a suffix parenthetical:

bear = compute_function(beep, boop)

Routines retrieved from fields can also be invoked, as with any expression.