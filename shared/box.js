"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBox = exports.unbox = exports.makeBox = void 0;
const makeBox = (x) => ([x]);
exports.makeBox = makeBox;
const unbox = (b) => b[0];
exports.unbox = unbox;
const setBox = (b, v) => { b[0] = v; return; };
exports.setBox = setBox;
