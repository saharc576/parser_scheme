"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allT = exports.isEmpty = exports.rest = exports.second = exports.first = exports.cons = void 0;
// List operations similar to car/cdr/cadr in Scheme
const ramda_1 = require("ramda");
const cons = (x, xs) => [x].concat(xs);
exports.cons = cons;
const first = (x) => x[0];
exports.first = first;
const second = (x) => x[1];
exports.second = second;
const rest = (x) => x.slice(1);
exports.rest = rest;
const isEmpty = (x) => Array.isArray(x) && x.length === 0;
exports.isEmpty = isEmpty;
// A useful type predicate for homogeneous lists
const allT = (isT, x) => ramda_1.all(isT, x);
exports.allT = allT;
