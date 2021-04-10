"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resultToOptional = exports.safe3 = exports.safe2 = exports.zipWithResult = exports.mapResult = exports.isOkT = exports.either = exports.bind = exports.isFailure = exports.isOk = exports.makeFailure = exports.makeOk = void 0;
const list_1 = require("./list");
const optional_1 = require("./optional");
const makeOk = (value) => ({ tag: "Ok", value: value });
exports.makeOk = makeOk;
const makeFailure = (message) => ({ tag: "Failure", message: message });
exports.makeFailure = makeFailure;
const isOk = (r) => r.tag === "Ok";
exports.isOk = isOk;
const isFailure = (r) => r.tag === "Failure";
exports.isFailure = isFailure;
const bind = (r, f) => exports.isOk(r) ? f(r.value) : r;
exports.bind = bind;
const either = (r, ifOk, ifFailure) => exports.isOk(r) ? ifOk(r.value) : ifFailure(r.message);
exports.either = either;
// Purpose: Test whether a result is Ok and of a
//          specified type (using a given type predicate)
// Example:
//     const r: Result<Exp> = bind(p("(+ x 1)"), parseL3Exp);
//     isOkT(isAppExp)(r) ? [here "r" is Ok<AppExp>]
const isOkT = (pred) => (r) => exports.isOk(r) && pred(r.value);
exports.isOkT = isOkT;
// Purpose: Like map on an array - but when the transformer function applied returns a Result<T>
//          With f: T=>Result<U> and list: T[] return a Result<U[]> 
//          If one of the items of the list fails on f - returns the Failure on the first item that fails.
// Example: 
// mapResult((x) => x === 0 ? makeFailure("div by 0") : makeOk(1/x), [1,2]) ==> {tag:"Ok", value:[1, 0.5]}
// mapResult((x) => x === 0 ? makeFailure("div by 0") : makeOk(1/x), [1,0,2]) ==> {tag:"Failure", message:"div by 0"}
const mapResult = (f, list) => list_1.isEmpty(list) ? exports.makeOk([]) :
    exports.bind(f(list_1.first(list)), (fa) => exports.bind(exports.mapResult(f, list_1.rest(list)), (fas) => exports.makeOk(list_1.cons(fa, fas))));
exports.mapResult = mapResult;
const zipWithResult = (f, xs, ys) => xs.length === 0 || ys.length === 0 ? exports.makeOk([]) :
    exports.bind(f(list_1.first(xs), list_1.first(ys)), (fxy) => exports.bind(exports.zipWithResult(f, list_1.rest(xs), list_1.rest(ys)), (fxys) => exports.makeOk(list_1.cons(fxy, fxys))));
exports.zipWithResult = zipWithResult;
const safe2 = (f) => (xr, yr) => exports.bind(xr, (x) => exports.bind(yr, (y) => f(x, y)));
exports.safe2 = safe2;
const safe3 = (f) => (xr, yr, zr) => exports.bind(xr, (x) => exports.bind(yr, (y) => exports.bind(zr, (z) => f(x, y, z))));
exports.safe3 = safe3;
const resultToOptional = (r) => exports.either(r, optional_1.makeSome, _ => optional_1.makeNone());
exports.resultToOptional = resultToOptional;
