import { Type } from "./Token";
import "reflect-metadata";
import { Provider } from "./Provider";
import { IforwardRef } from "./forwardRef";
export interface Imodule<T = any> {
    imports?: Array<Type<T>>;
    providers?: (Provider<T> | Type<T> | IforwardRef<T>)[];
    controllers?: Type<T>[];
}
export declare function Module(option?: Imodule): (target: any) => any;
export declare function getModuleMeataParams(target: any): any;
