"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenName = exports.InjectToken = void 0;
class InjectToken {
    constructor(injectIdefer) {
        this.injectIdefer = injectIdefer;
    }
}
exports.InjectToken = InjectToken;
function getTokenName(token) {
    return (typeof token === "string")
        ? token
        : (token instanceof InjectToken
            ? token.injectIdefer : token.name);
}
exports.getTokenName = getTokenName;
