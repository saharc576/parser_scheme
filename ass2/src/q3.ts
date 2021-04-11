import { map, reduce } from 'ramda';
import { ClassExp, ProcExp, Exp, Program } from "./L31-ast";
import { Result, makeFailure } from "../shared/result";
import { makeNumExp, makeProcExp, makeVarDecl, makeIfExp, makeStrExp } from "../imp/L3-ast";
import { second } from '../shared/list';

/*
Purpose: Transform ClassExp to ProcExp
Signature: for2proc(classExp)
Type: ClassExp => ProcExp
*/
export const class2proc = (exp: ClassExp): ProcExp => {
    
    
    const fields = exp.fields;
    const methods = exp.methods;
    const methodsNames = map(m => m.var , methods);
    const genericStr = "eq? msg '";
    // const initVal = makeIfExp(makeStrExp(`eq? msg ${methodsNames[0]}`),makeStrExp(`${makeProcExp([], fields[0])}`),makeStrExp(""))
    const procBody = makeProcExp(fields, [makeProcExp([makeVarDecl("msg")], 
        reduce((acc, curr) => {acc[0].test; return acc } , 
        [makeIfExp(makeStrExp(""),makeStrExp(""),makeStrExp(""))], methodsNames )))
    // makeProcExp()
    

    return makeProcExp([makeVarDecl("Sdf")], [makeNumExp(1)] )
}
   


/*
Purpose: Transform L31 AST to L3 AST
Signature: l31ToL3(l31AST)
Type: [Exp | Program] => Result<Exp | Program>
*/
export const L31ToL3 = (exp: Exp | Program): Result<Exp | Program> =>
    makeFailure("TODO");
