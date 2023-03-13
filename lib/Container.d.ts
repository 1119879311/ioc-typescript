import "reflect-metadata";
import { ClassProvider, Provider } from "./Provider";
import { Token, Type } from "./Token";
import { IforwardRef } from './forwardRef';
export declare class ContainerBase {
    protected instances: Map<Token<any>, any>;
    protected instancesforwardMap: Map<Token<any>, Object[]>;
    protected providers: Map<Token<any>, Provider<any>>;
    getInstances(): Map<Token<any>, any>;
    addProvider<T = any>(provider: Type<T> | Provider<T> | IforwardRef<T>): this;
    addProviders<T = any>(providers: Array<Type<T> | Provider<T> | IforwardRef<T>>): this;
    /**
     *
     * @param providerIforwardRef:  IforwardRef(()=> 结果)
     * @param provide
     */
    protected handleProviderForwardRef<T>(providerIforwardRef: IforwardRef<T>, provide?: Token<T>): void;
    /**
     *
     * @param provider:Provider
     * {provide:"",useClass:}
     * {provide:"",useFactory:}
     * {provide:"",useValue:}
     *
     */
    bind<T>(provider: Provider<T>): this;
    protected getProviderForwardRef<T = any>(provider: Provider<T>): IforwardRef<any>;
    initLoading(): this;
    protected loadProviders(): void;
    protected LoadForwardProviders(): void;
    get<T>(type: Token<T>): any;
    /**
     *  获取注解的值，三种类型
     * @param type
     * @param provider
     * @returns
     */
    protected injectWithProvider<T>(type: Token<T>, provider: Provider<T>): T | Type<T> | IforwardRef<T>;
    protected injectWidthClassProvider<T>(provider: ClassProvider<T>): T;
    protected getInjectConstructParams<T>(target: Type<T>): any[];
    protected assetInjectableIsClassProvide<T>(provider: ClassProvider<T>): void;
    protected assetClassProvideEqual(provide: any, useClass: Type<any>): void;
}
export declare class Container<K> extends ContainerBase {
    private controllerInstance;
    private modulesInstance;
    constructor(entryModule?: Type<K>);
    init<T>(entryModule: Type<T>): void;
    protected filterTypeInstance(): void;
    getControllerInstance(): any[];
    getModulesInstance(): any[];
    bindModule<T>(module: Type<T>): void;
    private bindLoadModule;
    private bindModuleLoadImports;
    private bindModuleLoadControllers;
}
