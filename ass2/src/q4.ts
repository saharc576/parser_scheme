import { Exp, Program, isProgram, isDefineExp, isNumExp, isBoolExp, isPrimOp, isVarRef, isAppExp, isIfExp, isProcExp, CExp, AppExp  } from '../imp/L3-ast';
import { Result, makeFailure, makeOk, bind, safe3, mapResult, safe2 } from '../shared/result';
import { map } from "ramda";

/*
Purpose: Transform L2 AST to Python program string
Signature: l2ToPython(l2AST)
Type: [EXP | Program] => Result<string>
*/
export const l2ToPython = (exp: Exp | Program): Result<string>  => 
    isProgram(exp) ? processProgram(exp.exps) :
    isDefineExp(exp) ? bind(l2ToPython(exp.val), val => makeOk(`${exp.var.var} = ${val}`)) :
    isNumExp(exp) ? makeOk(exp.val.toString()) :
    isBoolExp(exp) ? makeOk(exp.val ? 'True' : 'False') :
    isPrimOp(exp) ? processPrimOp(exp.op) :
    isVarRef(exp) ? makeOk(exp.var) :
    isAppExp(exp) ? processAppExp(exp) :
    isIfExp(exp) ? safe3((test: string, then: string, alt: string) => makeOk(`(${then} if ${test} else ${alt})`))
                    (l2ToPython(exp.test), l2ToPython(exp.then), l2ToPython(exp.alt)) :
    isProcExp(exp) ? bind(mapResult(l2ToPython, exp.body), body => makeOk(`(lambda ${map(arg => arg.var, exp.args).join(",")} : ${body[0]})`)) :
    makeFailure("Never");

const processProgram = (exps: Exp[]): Result<string>  => 
    bind(mapResult(l2ToPython, exps),
         exps => makeOk(`${exps.join("\n")}`));

/* 
    function handles 3 cases - all are primOps:
        1. it is a "not" operator
        2. it is one of the primitive operators [["number?","boolean?"],["eq?","=", "and", "or", ">", "<"], ["/", "-", "*", "+"]]
        3. it is a function which applied on parameters
*/         
const processAppExp = (exp: AppExp): Result<string>  => 
    isPrimOp(exp.rator) && exp.rator.op === "not" ? bind(mapResult(l2ToPython, exp.rands), rands => makeOk(`(not ${rands[0]})`)) :
    isPrimOp(exp.rator) ? (
        ["number?","boolean?"].includes(exp.rator.op) ?
            safe2((rator: string, rands: string[]) => makeOk(`${rator}(${rands[0]})`))
                (l2ToPython(exp.rator), mapResult(l2ToPython, exp.rands)) 
            :
        ["eq?","=", "and", "or", ">", "<"].includes(exp.rator.op) ?
            safe2((rator: string, rands: string[]) => makeOk(`(${rands[0]} ${rator} ${rands[1]})`))
                (l2ToPython(exp.rator), mapResult(l2ToPython, exp.rands)) 
            :
            safe2((rator: string, rands: string[]) => makeOk(`(${rands.join(` ${rator} `)})`))
                (l2ToPython(exp.rator), mapResult(l2ToPython, exp.rands)) 
    ):
    safe2((rator: string, rands: string[]) => makeOk(`${rator}(${rands.join(",")})`))
        (l2ToPython(exp.rator), mapResult(l2ToPython, exp.rands));


const processPrimOp = (op: string): Result<string>  => 
    op === "=" ? makeOk("==")    :
    op === "not" ? makeOk("not") :
    op === "or" ? makeOk("||")   :
    op === "and" ? makeOk("&&")  :
    op === "eq?" ? makeOk("==")  :
    op === "number?" ? makeOk("(lambda x : (type(x) == int)") :     // is the type inportant? 
    op === "boolean?" ? makeOk("(lambda x : (type(x) == bool)") :
    makeOk(op);