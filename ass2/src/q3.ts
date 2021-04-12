import { map, reduce } from 'ramda';
import { ClassExp, ProcExp, Exp, Program, Binding, isBinding, makeClassExp, isClassExp } from "./L31-ast";
import { Result, makeFailure } from "../shared/result";
import { makeNumExp, makeProcExp, makeVarDecl, makeIfExp, makeStrExp, CExp } from "../imp/L3-ast";
import { rest, second } from '../shared/list';

/*
Purpose: Transform ClassExp to ProcExp
Signature: for2proc(classExp)
Type: ClassExp => ProcExp
*/
export const class2proc = (exp: ClassExp): ProcExp => {
    
    const tmp = makeProcExp(exp.fields , [makeProcExp([makeVarDecl("msg")], rewriteMethods(exp.methods))])
    console.log(tmp);
    return tmp;
}

const rewriteMethods = (methods: Binding[]): CExp[] => 
    methods.length === 1 ? [makeStrExp(`(if (eq? msg ${methods[0].val})) ((${methods[0].var})) #f)`)]:
        [makeStrExp(`(if (eq? msg ${methods[0].val})) ((${methods[0].var})) ${rewriteMethods(rest(methods))}`)]


/*
Purpose: Transform L31 AST to L3 AST
Signature: l31ToL3(l31AST)
Type: [Exp | Program] => Result<Exp | Program>
*/
export const L31ToL3 = (exp: Exp | Program): Result<Exp | Program> =>
    makeFailure("TODO");
