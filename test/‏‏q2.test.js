"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const chai_1 = require("chai");
const L3_eval_1 = require("../imp/L3-eval");
const result_1 = require("../shared/result");
const L3_ast_1 = require("../imp/L3-ast");
const evalPrimitive_1 = require("../imp/evalPrimitive");
const evalP = (x) => result_1.bind(L3_ast_1.parseL3(x), L3_eval_1.evalL3program);
const q2 = fs_1.default.readFileSync(__dirname + '/../src/q2.l3', { encoding: 'utf-8' });
describe('Q2 Tests', () => {
    it('append tests', () => {
        chai_1.expect(evalP(`(L3 ` + q2 + ` (append (list 1) (list 2 3)))`)).to.deep.equal(result_1.makeOk(evalPrimitive_1.listPrim([1, 2, 3])));
    });
    it(`reverse tests`, () => {
        chai_1.expect(evalP(`(L3 ` + q2 + ` (reverse  (list 1 2 3)))`)).to.deep.equal(result_1.makeOk(evalPrimitive_1.listPrim([3, 2, 1])));
        chai_1.expect(evalP(`(L3 ` + q2 + ` (reverse  '()))`)).to.deep.equal(result_1.makeOk(evalPrimitive_1.listPrim([])));
    });
    it(`duplicate-items tests`, () => {
        chai_1.expect(evalP(`(L3` + q2 + `(duplicate-items (list 1 2 3) (list 1 0) ))`)).to.deep.equal(result_1.makeOk(evalPrimitive_1.listPrim([1, 3])));
        chai_1.expect(evalP(`(L3` + q2 + `(duplicate-items (list 1 2 3 4) (list 1 1) ))`)).to.deep.equal(result_1.makeOk(evalPrimitive_1.listPrim([1, 2, 3, 4])));
    });
    it(`payment`, () => {
        chai_1.expect(evalP(`(L3` + q2 + `(payment 10 (list 5 5 10)))`)).to.deep.equal(result_1.makeOk(2));
        chai_1.expect(evalP(`(L3` + q2 + `(payment 5 (list 1 1 1 2 2 5 10)))`)).to.deep.equal(result_1.makeOk(3));
        chai_1.expect(evalP(`(L3` + q2 + `(payment 0 (list 1 2 5)))`)).to.deep.equal(result_1.makeOk(1));
        chai_1.expect(evalP(`(L3` + q2 + `(payment 5 '()))`)).to.deep.equal(result_1.makeOk(0));
    });
    it(`"compose-n`, () => {
        chai_1.expect(evalP(`(L3` + q2 + `((compose-n (lambda(x) (+ 2 x))2) 3))`)).to.deep.equal(result_1.makeOk(7));
        chai_1.expect(evalP(`(L3` + q2 + `((compose-n (lambda(x) (* 2 x))2) 3))`)).to.deep.equal(result_1.makeOk(12));
    });
});
