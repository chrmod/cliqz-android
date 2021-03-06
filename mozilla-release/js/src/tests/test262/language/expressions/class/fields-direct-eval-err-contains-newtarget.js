// |reftest| skip -- class-fields-public is not supported
// This file was procedurally generated from the following sources:
// - src/class-fields/eval-err-contains-newtarget.case
// - src/class-fields/initializer-eval-newtarget/cls-expr-fields-eval.template
/*---
description: error if `new.target` in StatementList of eval (direct eval)
esid: sec-performeval-rules-in-initializer
features: [class, class-fields-public]
flags: [generated]
info: |
    Additional Early Error Rules for Eval Inside Initializer
    These static semantics are applied by PerformEval when a direct eval call occurs inside a class field initializer.
    ScriptBody : StatementList

      ...
      The remaining eval rules apply as outside a constructor, inside a method, and inside a function.

    Additional Early Error Rules for Eval Outside Functions
    These static semantics are applied by PerformEval when a direct eval call occurs outside of any function.
    ScriptBody:StatementList

      It is a Syntax Error if StatementList Contains NewTarget.

---*/


var executed = false;
var C = class {
  x = eval('executed = true; new.target;');
}

var c = new C();

assert.sameValue(executed, true);
assert.sameValue(c.x, undefined);

reportCompare(0, 0);
