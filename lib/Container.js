"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = exports.ContainerBase = void 0;
require("reflect-metadata");
const Inject_1 = require("./Inject");
const Module_1 = require("./Module");
const Provider_1 = require("./Provider");
const Token_1 = require("./Token");
const Uitl_1 = require("./Uitl");
const forwardRef_1 = require("./forwardRef");
// 单例的
class ContainerBase {
    constructor() {
        this.instances = new Map();
        this.instancesforwardMap = new Map(); // 暂存依赖缓存的对象
        this.providers = new Map();
    }
    getInstances() {
        return this.instances;
    }
    addProvider(provider) {
        if ((0, Provider_1.isProvider)(provider)) {
            this.bind(provider);
        }
        else if ((0, forwardRef_1.isforwardRef)(provider)) {
            this.handleProviderForwardRef(provider);
        }
        else {
            this.bind({ provide: provider, useClass: provider });
        }
        return this;
    }
    // 批量添加 注入
    addProviders(providers) {
        if (Array.isArray(providers)) {
            providers.forEach(provider => this.addProvider(provider));
        }
        return this;
    }
    // 收集 循环注入的处理
    /**
     *
     * @param providerIforwardRef:  IforwardRef(()=> 结果)
     * @param provide
     */
    handleProviderForwardRef(providerIforwardRef, provide) {
        // 肯定是 Iforward
        if ((0, Uitl_1.isFun)(providerIforwardRef)) {
            const resRroviderValue = providerIforwardRef(); //IforwardRef(()=> 结果) === 结果
            const token = provide || resRroviderValue;
            if ((0, Uitl_1.isFun)(resRroviderValue) && (0, Uitl_1.isNotBaseType)(resRroviderValue.name)) { // 如果是一个类，要进行实例化
                // 创建依赖循环的缓存数据
                //  console.log("-----------------sfd",token,resRroviderValue)
                this.assetClassProvideEqual(token, resRroviderValue);
                // if( isFun(token) && isFun(resRroviderValue) && token !==resRroviderValue){
                //   throw new Error(`When the type of provider is ClassProvider and the type of provider and useClass is Class, the provide ${token.name} and useClass ${resRroviderValue.name} must be equal ,but the results are not equal`)
                // }
                this.instancesforwardMap.set(token, Object.create(resRroviderValue.prototype));
            }
            else { // 否则就存在实例中心
                this.instances.set(token, resRroviderValue);
            }
        }
    }
    // 单个绑定注入  三种判定方式
    /**
     *
     * @param provider:Provider
     * {provide:"",useClass:}
     * {provide:"",useFactory:}
     * {provide:"",useValue:}
     *
     */
    bind(provider) {
        if (!(0, Provider_1.isProvider)(provider)) {
            throw new Error("参数不合法");
        }
        let providerValue = this.getProviderForwardRef(provider);
        // 判定 是否 模块
        if ((0, forwardRef_1.isforwardRef)(providerValue)) {
            this.handleProviderForwardRef(providerValue, provider.provide);
        }
        else {
            if ((0, Provider_1.isClassProvider)(provider)) {
                this.assetClassProvideEqual(provider.provide, provider.useClass);
            }
            this.providers.set(provider.provide, provider);
        }
        return this;
    }
    //获取provider 的值
    getProviderForwardRef(provider) {
        if ((0, Provider_1.isClassProvider)(provider)) {
            return provider.useClass;
        }
        if ((0, Provider_1.isFactoryProvider)(provider)) {
            return provider.useFactory;
        }
        if ((0, Provider_1.isValueProvider)(provider)) {
            return provider.useValue;
        }
    }
    initLoading() {
        this.loadProviders();
        this.LoadForwardProviders();
        this.providers.clear();
        this.instancesforwardMap.clear();
        return this;
    }
    // 加载 注入,开始实例化
    loadProviders() {
        this.providers.forEach((_, key) => this.get(key));
    }
    // 加载 实例
    LoadForwardProviders() {
        this.instancesforwardMap.forEach((value, key) => {
            // console.log("instancesforwardMap-----1212",value,key ,value.constructor)
            // 获取原来的实例的参数
            let ins;
            if ((0, Uitl_1.isFun)(key) && (0, Uitl_1.isNotBaseType)(key.name)) {
                ins = key;
            }
            else if ((0, Uitl_1.isObj)(value) && value.constructor && (0, Uitl_1.isNotBaseType)(value.constructor.name)) {
                ins = value.constructor;
            }
            else {
                const errmsg = ` No provider for type ${(0, Token_1.getTokenName)(key)}`;
                throw new Error(errmsg);
            }
            // console.log("instancesforwardMap-ins",ins)
            this.assetInjectableIsClassProvide({ provide: key, useClass: ins });
            let arg = this.getInjectConstructParams(ins);
            Object.assign(value, new ins(...arg));
            this.instances.set(key, value);
        });
    }
    get(type) {
        let instance = this.instances.get(type);
        if (instance) {
            return instance;
        }
        let provider = this.providers.get(type);
        // console.log("provider",type,provider)
        if (provider && provider.useClass) {
            this.assetInjectableIsClassProvide(provider);
        }
        let result = this.injectWithProvider(type, provider);
        this.instances.set(type, result);
        return result;
    }
    /**
     *  获取注解的值，三种类型
     * @param type
     * @param provider
     * @returns
     */
    injectWithProvider(type, provider) {
        if (provider === undefined) {
            const errmsg = ` No provider for type ${(0, Token_1.getTokenName)(type)}`;
            throw new Error(errmsg);
        }
        if ((0, Provider_1.isClassProvider)(provider)) {
            return this.injectWidthClassProvider(provider);
        }
        else if ((0, Provider_1.isValueProvider)(provider)) {
            return provider.useValue;
        }
        else if ((0, Provider_1.isFactoryProvider)(provider)) {
            return provider.useFactory();
        }
        else {
            throw new Error(` No  belong for provider for type ${(0, Token_1.getTokenName)(type)}`);
        }
    }
    injectWidthClassProvider(provider) {
        let target = provider.useClass; // 取得
        if (!(0, forwardRef_1.isforwardRef)(target)) {
            let parameterMeta = this.getInjectConstructParams(target) || [];
            // console.log("parameterMeta",parameterMeta,target)
            let instance = Reflect.construct(target, parameterMeta);
            return instance;
        }
    }
    //去获取构造函数的参数
    getInjectConstructParams(target) {
        const InjectParams = (0, Inject_1.getInjectParams)(target);
        // console.log("InjectParams",InjectParams)
        // console.log("args",target,getInjectConstructParams(target))
        let args = (0, Uitl_1.getInjectConstructParams)(target) || Object.values(InjectParams).reverse();
        // console.log("args----",getInjectConstructParams(target),'----',target,args,InjectParams)
        return args.map((itme, index) => {
            // 判定
            let injectMedate = InjectParams[index]; //判断是不是inject 注入的
            let paramsToken = injectMedate == undefined ? itme : injectMedate; //如果不是inject 注入就是其他类型的注入
            //去依赖中心找对应的参数实例
            let instance = this.instances.get(paramsToken);
            if (instance) {
                return instance;
            }
            // 参数类型，有可能是forwarkRef
            if ((0, forwardRef_1.isforwardRef)(paramsToken) && (0, Uitl_1.isFun)(paramsToken)) { // 如果是 循环依赖，从实例种取值
                paramsToken = paramsToken();
            }
            let instanceforward = this.instancesforwardMap.get(paramsToken);
            // console.log("instanceforward", paramsToken, instanceforward, this.instancesforwardMap);
            if (instanceforward) {
                return instanceforward;
            }
            if (paramsToken === undefined) {
                return paramsToken;
            }
            let provider = this.providers.get(paramsToken);
            // console.log("getInjectConstructParams--provider", paramsToken, provider, this.providers);
            return this.injectWithProvider(paramsToken, provider);
        });
    }
    // Provider  的是类型是 ClassProvider  ,必须是 用Injectable 注解
    assetInjectableIsClassProvide(provider) {
        var _a, _b;
        if ((0, Provider_1.isClassProvider)(provider) && !(provider.provide instanceof Token_1.InjectToken) && !(0, Uitl_1.isInjectable)(provider.useClass)) {
            let errmsg = `cannot  Provider (${(0, Token_1.getTokenName)(provider.provide)}) using useClass (${(0, Token_1.getTokenName)((_a = provider.useClass) === null || _a === void 0 ? void 0 : _a.name)})，
          ${(0, Token_1.getTokenName)((_b = provider.useClass) === null || _b === void 0 ? void 0 : _b.name)} is not injectable
       `;
            throw new Error(errmsg);
        }
    }
    // Provider  的是类型是 ClassProvider ,且 provide 和useClass 的类型都是class 的时候， provide 和 useClass必须是相等的
    assetClassProvideEqual(provide, useClass) {
        if ((0, Uitl_1.isFun)(provide) && (0, Uitl_1.isFun)(useClass) && provide !== useClass) {
            throw new Error(`When the type of provider is ClassProvider and the type of provider and useClass is Class, the provide ${provide.name} and useClass ${useClass.name} must be equal ,but the results are not equal`);
        }
    }
}
exports.ContainerBase = ContainerBase;
class Container extends ContainerBase {
    constructor(entryModule) {
        super();
        this.controllerInstance = [];
        this.modulesInstance = [];
        entryModule && this.init(entryModule);
    }
    init(entryModule) {
        this.bindModule(entryModule);
        this.initLoading();
        this.filterTypeInstance();
    }
    filterTypeInstance() {
        this.instances.forEach((value, key) => {
            // console.log("filterTypeInstance",key,value,isFun(key) && isNotBaseType(key.name), isController(key))
            if ((0, Uitl_1.isFun)(key) && (0, Uitl_1.isNotBaseType)(key.name)) {
                (0, Uitl_1.isController)(key) && this.controllerInstance.push(value);
                (0, Uitl_1.isModule)(key) && this.modulesInstance.push(value);
            }
        });
    }
    getControllerInstance() {
        return this.controllerInstance;
    }
    getModulesInstance() {
        return this.modulesInstance;
    }
    //模块绑定
    bindModule(module) {
        if (!(0, Uitl_1.isModule)(module)) {
            throw new Error(` cannot  imports [${(0, Token_1.getTokenName)(module)}] using  [${(0, Token_1.getTokenName)(module)}]， ${(0, Token_1.getTokenName)(module)} is not module `);
        }
        const provider = { provide: module, useClass: module };
        (0, Uitl_1.setInjectable)(module); //标志为可注入依赖
        this.bind(provider);
        this.bindLoadModule(provider);
    }
    bindLoadModule(provider) {
        let meataData = (0, Module_1.getModuleMeataParams)(provider.useClass);
        if (!meataData)
            return;
        this.addProviders(meataData.providers || []);
        this.bindModuleLoadControllers(meataData.controllers || []);
        this.bindModuleLoadImports(meataData.imports || []);
    }
    bindModuleLoadImports(imports) {
        if (Array.isArray(imports)) {
            imports.forEach((itme) => this.bindModule(itme));
        }
    }
    bindModuleLoadControllers(providers) {
        if (Array.isArray(providers)) {
            providers.forEach((itme) => {
                (0, Uitl_1.setController)(itme); //标志位控制器
                (0, Uitl_1.setInjectable)(itme); //标志为可注入依赖
                this.bind({ provide: itme, useClass: itme });
            });
        }
    }
}
exports.Container = Container;
