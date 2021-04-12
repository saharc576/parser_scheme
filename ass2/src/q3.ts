import { map, zipWith } from 'ramda'
import { makeBinding, LetExp, makeLetExp, makeNumExp, makeProcExp, makeVarDecl, makeIfExp, CExp, makePrimOp, ClassExp, ProcExp, Exp, Program, Binding,  makeClassExp, isClassExp, makeBoolExp, makeAppExp, makeVarRef, isProgram, makeProgram, isExp, isDefineExp, makeDefineExp, isNumExp, isBoolExp, isPrimOp, isVarRef, isAppExp, isIfExp, isProcExp, VarDecl, isLetExp, isLitExp } from "./L31-ast";
import { Result, makeFailure, makeOk, mapResult, bind, safe2, safe3 } from "../shared/result";
import { allT, first, rest, second } from '../shared/list';

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
    
    isProgram(exp) ? bind(mapResult(L31ExpToL3, exp.exps), (exps: Exp[]) => makeOk(makeProgram(exps))) :
    isExp(exp) ? L31ExpToL3(exp) :
    makeFailure("Never");
    
    
export const L31ExpToL3 = (exp: Exp): Result<Exp> =>
    isDefineExp(exp) ? bind(L31CExpToL3(exp.val), (val: CExp) => makeOk(makeDefineExp(exp.var, val))) :
    L31CExpToL3(exp);

export const L31CExpToL3 = (exp: CExp): Result<CExp> => 
    isNumExp(exp) ? makeOk(exp)  :
    isBoolExp(exp) ? makeOk(exp) :
    isPrimOp(exp) ? makeOk(exp)  :
    isVarRef(exp) ? makeOk(exp)  :
    isLitExp(exp) ? makeOk(exp)  :
    isAppExp(exp) ? safe2((rator: CExp, rands: CExp[]) => makeOk(makeAppExp(rator, rands)))
                        (L31CExpToL3(exp.rator), mapResult(L31CExpToL3, exp.rands)) :
    isIfExp(exp) ? safe3((test: CExp, then: CExp, alt: CExp) => makeOk(makeIfExp(test, then, alt)))
                    (L31CExpToL3(exp.test), L31CExpToL3(exp.then), L31CExpToL3(exp.alt)) :
    isProcExp(exp) ? bind(mapResult(L31CExpToL3, exp.body), (body: CExp[]) => makeOk(makeProcExp(exp.args, body))) :
    isLetExp(exp) ? safe2((bindings: Binding[], body: CExp[]) => makeOk(makeLetExp(bindings, body)))
                        (bindingHandler(exp.bindings), mapResult(x => L31CExpToL3(x), exp.body)):
    isClassExp(exp) ? safe2((fields: VarDecl[], methods: Binding[]) => makeOk(class2proc((makeClassExp(fields, methods)))))
                        (varDeclHandler(exp.fields), bindingHandler(exp.methods)):
    makeFailure(`Unexpected CExp: ${exp.tag}`);

    const bindingHandler = (bindings: Binding[]): Result<Binding[]> => {

        const vars = map(b => b.var.var , bindings);
        const valsResult = mapResult(b => L31CExpToL3(b.val), bindings);
        const bindingsResult = bind(valsResult, (vals: CExp[]) => makeOk(zipWith(makeBinding, vars, vals)));
        return bindingsResult;
    }

    const varDeclHandler = (vars: VarDecl[]): Result<VarDecl[]> => 
         mapResult(v => makeOk(v) , vars)
    
