"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalParse = exports.evalL3program = exports.evalSequence = exports.isTrueValue = void 0;
// L3-eval.ts
const ramda_1 = require("ramda");
const L3_ast_1 = require("./L3-ast");
const L3_ast_2 = require("./L3-ast");
const L3_ast_3 = require("./L3-ast");
const L3_ast_4 = require("./L3-ast");
const L3_env_1 = require("./L3-env");
const L3_value_1 = require("./L3-value");
const list_1 = require("../shared/list");
const type_predicates_1 = require("../shared/type-predicates");
const result_1 = require("../shared/result");
const substitute_1 = require("./substitute");
const evalPrimitive_1 = require("./evalPrimitive");
const parser_1 = require("../shared/parser");
// ========================================================
// Eval functions
const L3applicativeEval = (exp, env) => L3_ast_2.isNumExp(exp) ? result_1.makeOk(exp.val) :
    L3_ast_2.isBoolExp(exp) ? result_1.makeOk(exp.val) :
        L3_ast_2.isStrExp(exp) ? result_1.makeOk(exp.val) :
            L3_ast_2.isPrimOp(exp) ? result_1.makeOk(exp) :
                L3_ast_2.isVarRef(exp) ? L3_env_1.applyEnv(env, exp.var) :
                    L3_ast_2.isLitExp(exp) ? result_1.makeOk(exp.val) :
                        L3_ast_2.isIfExp(exp) ? evalIf(exp, env) :
                            L3_ast_2.isProcExp(exp) ? evalProc(exp, env) :
                                L3_ast_2.isAppExp(exp) ? result_1.safe2((rator, rands) => L3applyProcedure(rator, rands, env))(L3applicativeEval(exp.rator, env), result_1.mapResult(rand => L3applicativeEval(rand, env), exp.rands)) :
                                    L3_ast_1.isLetExp(exp) ? result_1.makeFailure('"let" not supported (yet)') :
                                        exp;
const isTrueValue = (x) => !(x === false);
exports.isTrueValue = isTrueValue;
const evalIf = (exp, env) => result_1.bind(L3applicativeEval(exp.test, env), (test) => exports.isTrueValue(test) ? L3applicativeEval(exp.then, env) : L3applicativeEval(exp.alt, env));
const evalProc = (exp, env) => result_1.makeOk(L3_value_1.makeClosure(exp.args, exp.body));
const L3applyProcedure = (proc, args, env) => L3_ast_2.isPrimOp(proc) ? evalPrimitive_1.applyPrimitive(proc, args) :
    L3_value_1.isClosure(proc) ? applyClosure(proc, args, env) :
        result_1.makeFailure("Bad procedure " + JSON.stringify(proc));
// Applications are computed by substituting computed
// values into the body of the closure.
// To make the types fit - computed values of params must be
// turned back in Literal Expressions that eval to the computed value.
const valueToLitExp = (v) => type_predicates_1.isNumber(v) ? L3_ast_3.makeNumExp(v) :
    type_predicates_1.isBoolean(v) ? L3_ast_3.makeBoolExp(v) :
        type_predicates_1.isString(v) ? L3_ast_3.makeStrExp(v) :
            L3_ast_2.isPrimOp(v) ? v :
                L3_value_1.isClosure(v) ? L3_ast_3.makeProcExp(v.params, v.body) :
                    L3_ast_3.makeLitExp(v);
const applyClosure = (proc, args, env) => {
    const vars = ramda_1.map((v) => v.var, proc.params);
    const body = substitute_1.renameExps(proc.body);
    const litArgs = ramda_1.map(valueToLitExp, args);
    return exports.evalSequence(substitute_1.substitute(body, vars, litArgs), env);
};
// Evaluate a sequence of expressions (in a program)
const evalSequence = (seq, env) => list_1.isEmpty(seq) ? result_1.makeFailure("Empty sequence") :
    L3_ast_2.isDefineExp(list_1.first(seq)) ? evalDefineExps(list_1.first(seq), list_1.rest(seq), env) :
        evalCExps(list_1.first(seq), list_1.rest(seq), env);
exports.evalSequence = evalSequence;
const evalCExps = (first, rest, env) => L3_ast_1.isCExp(first) && list_1.isEmpty(rest) ? L3applicativeEval(first, env) :
    L3_ast_1.isCExp(first) ? result_1.bind(L3applicativeEval(first, env), _ => exports.evalSequence(rest, env)) :
        result_1.makeFailure("Never");
// Eval a sequence of expressions when the first exp is a Define.
// Compute the rhs of the define, extend the env with the new binding
// then compute the rest of the exps in the new env.
const evalDefineExps = (def, exps, env) => L3_ast_2.isDefineExp(def) ? result_1.bind(L3applicativeEval(def.val, env), (rhs) => exports.evalSequence(exps, L3_env_1.makeEnv(def.var.var, rhs, env))) :
    result_1.makeFailure("Unexpected " + def);
// Main program
const evalL3program = (program) => exports.evalSequence(program.exps, L3_env_1.makeEmptyEnv());
exports.evalL3program = evalL3program;
const evalParse = (s) => result_1.bind(result_1.bind(parser_1.parse(s), L3_ast_4.parseL3Exp), (exp) => exports.evalSequence([exp], L3_env_1.makeEmptyEnv()));
exports.evalParse = evalParse;
