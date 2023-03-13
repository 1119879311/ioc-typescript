"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Injectable = void 0;
require("reflect-metadata");
const Constant_1 = require("./Constant");
function Injectable() {
    return function (target) {
        Reflect.defineMetadata(Constant_1.INJECTABLE_METADATA_KEY, true, target);
        return target;
    };
}
exports.Injectable = Injectable;
