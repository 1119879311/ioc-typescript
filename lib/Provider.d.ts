import { Token, Type } from "./Token";
import { IforwardRef } from "./forwardRef";
type Factory<T> = (...args: any[]) => T;
export interface BaseProvider<T> {
    provide: Token<T>;
}
export interface ClassProvider<T> extends BaseProvider<T> {
    provide: Token<T>;
    useClass: Type<T> | IforwardRef<T>;
}
export interface ValueProvider<T> extends BaseProvider<T> {
    provide: Token<T>;
    useValue: T | IforwardRef<T>;
}
export interface FactoryProvider<T> extends BaseProvider<T> {
    provide: Token<T>;
    useFactory: Factory<T> | IforwardRef<T>;
}
export declare function isClassProvider<T>(arg: unknown): arg is ClassProvider<T>;
export declare function isValueProvider<T>(arg: unknown): arg is ValueProvider<T>;
export declare function isFactoryProvider<T>(arg: unknown): arg is FactoryProvider<T>;
export declare function isProvider<T>(arg: unknown): arg is BaseProvider<T>;
export type Provider<T> = ClassProvider<T> | ValueProvider<T> | FactoryProvider<T>;
export {};
