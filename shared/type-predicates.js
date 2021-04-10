"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIdentifier = exports.isNumericString = exports.isError = exports.isBoolean = exports.isNumber = exports.isString = exports.isArray = void 0;
// ========================================================
// Type utilities
exports.isArray = Array.isArray;
const isString = (x) => typeof x === "string";
exports.isString = isString;
const isNumber = (x) => typeof x === "number";
exports.isNumber = isNumber;
const isBoolean = (x) => typeof x === "boolean";
exports.isBoolean = isBoolean;
const isError = (x) => x instanceof Error;
exports.isError = isError;
// A weird method to check that a string is a string encoding of a number
const isNumericString = (x) => JSON.stringify(+x) === x;
exports.isNumericString = isNumericString;
const isIdentifier = (x) => /[A-Za-z][A-Za-z0-9]*/i.test(x);
exports.isIdentifier = isIdentifier;
