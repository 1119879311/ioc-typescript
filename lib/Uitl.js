"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNotBaseType = exports.isObj = exports.isFun = exports.isString = exports.getInjectConstructParams = exports.setController = exports.setInjectable = exports.isInjectable = exports.isModule = exports.isController = void 0;
const Constant_1 = require("./Constant");
//是否控制器
function isController(target) {
    return Reflect.getMetadata(Constant_1.IS_Controller_KEY, target) === true;
}
exports.isController = isController;
//是否模块
function isModule(target) {
    return Reflect.getMetadata(Constant_1.IS_Module_KEY, target) === true;
}
exports.isModule = isModule;
//是否是注入依赖
function isInjectable(target) {
    return Reflect.getMetadata(Constant_1.INJECTABLE_METADATA_KEY, target) === true;
}
exports.isInjectable = isInjectable;
// 设置为可注入依赖
function setInjectable(target) {
    Reflect.defineMetadata(Constant_1.INJECTABLE_METADATA_KEY, true, target);
}
exports.setInjectable = setInjectable;
// 设置为控制器类型
function setController(target) {
    Reflect.defineMetadata(Constant_1.IS_Controller_KEY, true, target);
}
exports.setController = setController;
// 获取类构造函数参数
function getInjectConstructParams(target) {
    return Reflect.getMetadata(Constant_1.DesignParamtypes, target) || [];
}
exports.getInjectConstructParams = getInjectConstructParams;
function isString(value) {
    return typeof value === "string";
}
exports.isString = isString;
function isFun(value) {
    return typeof value === "function";
}
exports.isFun = isFun;
function isObj(value) {
    return typeof value === "object";
}
exports.isObj = isObj;
function isNotBaseType(name) {
    return !Constant_1.typeExInculeds.includes(name);
}
exports.isNotBaseType = isNotBaseType;
