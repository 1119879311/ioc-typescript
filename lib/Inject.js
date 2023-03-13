"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInjectParams = exports.Inject = void 0;
require("reflect-metadata");
const Constant_1 = require("./Constant");
function Inject(token) {
    return function (target, perperity, index) {
        let meta = Reflect.getMetadata(Constant_1.INJECT_METADATA_KEY, target, perperity) || {};
        meta[index] = token;
        // meta.unshift(token)
        Reflect.defineMetadata(Constant_1.INJECT_METADATA_KEY, meta, target, perperity);
    };
}
exports.Inject = Inject;
// export function Inject(token: Token<any>) {
//   return function (target: any, perperity: string, index: number) {
//     Reflect.defineMetadata(
//       INJECT_METADATA_KEY,
//       token,
//       target,
//       `index-${index}`
//     );
//   };
// }
function getInjectParams(target, perperity, index) {
    let result = Reflect.getMetadata(Constant_1.INJECT_METADATA_KEY, target, perperity) || {};
    return typeof index === "number" ? result[index] : result;
}
exports.getInjectParams = getInjectParams;
