import { Type } from "./Token";
export type IforwardRefPro<T> = {
    (): Type<T>;
    forwardRef: boolean;
};
export type IforwardRef<T> = () => Type<T>;
export declare function isforwardRef<T>(arg: unknown): arg is IforwardRef<T>;
export declare function forwardRef<T>(fn: () => any): () => any;
