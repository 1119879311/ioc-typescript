"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forwardRef = exports.isforwardRef = void 0;
function isforwardRef(arg) {
    return arg.forwardRef !== undefined;
}
exports.isforwardRef = isforwardRef;
function forwardRef(fn) {
    fn.forwardRef = true;
    return fn;
}
exports.forwardRef = forwardRef;
