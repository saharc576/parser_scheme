"use strict";
// ========================================================
// Value type definition for L3
Object.defineProperty(exports, "__esModule", { value: true });
exports.valueToString = exports.compoundSExpToString = exports.compoundSExpToArray = exports.closureToString = exports.isSymbolSExp = exports.makeSymbolSExp = exports.isEmptySExp = exports.makeEmptySExp = exports.isCompoundSExp = exports.makeCompoundSExp = exports.isSExp = exports.isClosure = exports.makeClosure = exports.isFunctional = void 0;
const L3_ast_1 = require("./L3-ast");
const type_predicates_1 = require("../shared/type-predicates");
const ramda_1 = require("ramda");
const isFunctional = (x) => L3_ast_1.isPrimOp(x) || exports.isClosure(x);
exports.isFunctional = isFunctional;
const makeClosure = (params, body) => ({ tag: "Closure", params: params, body: body });
exports.makeClosure = makeClosure;
const isClosure = (x) => x.tag === "Closure";
exports.isClosure = isClosure;
const isSExp = (x) => typeof (x) === 'string' || typeof (x) === 'boolean' || typeof (x) === 'number' ||
    exports.isSymbolSExp(x) || exports.isCompoundSExp(x) || exports.isEmptySExp(x) || L3_ast_1.isPrimOp(x) || exports.isClosure(x);
exports.isSExp = isSExp;
const makeCompoundSExp = (val1, val2) => ({ tag: "CompoundSexp", val1: val1, val2: val2 });
exports.makeCompoundSExp = makeCompoundSExp;
const isCompoundSExp = (x) => x.tag === "CompoundSexp";
exports.isCompoundSExp = isCompoundSExp;
const makeEmptySExp = () => ({ tag: "EmptySExp" });
exports.makeEmptySExp = makeEmptySExp;
const isEmptySExp = (x) => x.tag === "EmptySExp";
exports.isEmptySExp = isEmptySExp;
const makeSymbolSExp = (val) => ({ tag: "SymbolSExp", val: val });
exports.makeSymbolSExp = makeSymbolSExp;
const isSymbolSExp = (x) => x.tag === "SymbolSExp";
exports.isSymbolSExp = isSymbolSExp;
// Printable form for values
const closureToString = (c) => 
// `<Closure ${c.params} ${L3unparse(c.body)}>`
`<Closure ${c.params} ${c.body}>`;
exports.closureToString = closureToString;
const compoundSExpToArray = (cs, res) => exports.isEmptySExp(cs.val2) ? ramda_1.append(exports.valueToString(cs.val1), res) :
    exports.isCompoundSExp(cs.val2) ? exports.compoundSExpToArray(cs.val2, ramda_1.append(exports.valueToString(cs.val1), res)) :
        ({ s1: ramda_1.append(exports.valueToString(cs.val1), res), s2: exports.valueToString(cs.val2) });
exports.compoundSExpToArray = compoundSExpToArray;
const compoundSExpToString = (cs, css = exports.compoundSExpToArray(cs, [])) => type_predicates_1.isArray(css) ? `(${css.join(' ')})` :
    `(${css.s1.join(' ')} . ${css.s2})`;
exports.compoundSExpToString = compoundSExpToString;
const valueToString = (val) => type_predicates_1.isNumber(val) ? val.toString() :
    val === true ? '#t' :
        val === false ? '#f' :
            type_predicates_1.isString(val) ? `"${val}"` :
                exports.isClosure(val) ? exports.closureToString(val) :
                    L3_ast_1.isPrimOp(val) ? val.op :
                        exports.isSymbolSExp(val) ? val.val :
                            exports.isEmptySExp(val) ? "'()" :
                                exports.isCompoundSExp(val) ? exports.compoundSExpToString(val) :
                                    val;
exports.valueToString = valueToString;
