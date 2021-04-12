import { map, reduce } from 'ramda';
import {  makeNumExp, makeProcExp, makeVarDecl, makeIfExp, makeStrExp, CExp, makePrimOp, ClassExp, ProcExp, Exp, Program, Binding, isBinding, makeClassExp, isClassExp, makeBoolExp, makeAppExp, makeVarRef } from "./L31-ast";
import { Result, makeFailure, makeOk } from "../shared/result";
// import { makeNumExp, makeProcExp, makeVarDecl, makeIfExp, makeStrExp, CExp, makePrimOp } from "../imp/L3-ast";
import { rest, second } from '../shared/list';

/*
Purpose: Transform ClassExp to ProcExp
Signature: for2proc(classExp)
Type: ClassExp => ProcExp
*/
export const class2proc = (exp: ClassExp): ProcExp => 
     makeProcExp(exp.fields , [makeProcExp([makeVarDecl("msg")], [rewriteMethods(exp.methods)])])
    

const rewriteMethods = (methods: Binding[]): CExp => 
    methods.length === 1 ? makeIfExp(makeAppExp(makePrimOp("eq?"), [makeVarRef("msg"), makeVarRef(`'${methods[0].var.var}`)]), 
                                    makeAppExp(methods[0].val, []), 
                                    makeBoolExp(false)):
                                    makeIfExp(makeAppExp(makePrimOp("eq?"), [makeVarRef("msg"), makeVarRef(`'${methods[0].var.var}`)]), 
                                    makeAppExp(methods[0].val, []), 
                                    rewriteMethods(rest(methods)));



/*
Purpose: Transform L31 AST to L3 AST
Signature: l31ToL3(l31AST)
Type: [Exp | Program] => Result<Exp | Program>
*/
export const L31ToL3 = (exp: Exp | Program): Result<Exp | Program> => 
    isClassExp(exp) ? makeOk(class2proc(exp)) : makeFailure("TODO");

    
