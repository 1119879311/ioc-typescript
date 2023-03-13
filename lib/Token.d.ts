export interface Type<T> extends Function {
    new (...args: any[]): T;
}
export declare class InjectToken {
    injectIdefer: string;
    constructor(injectIdefer: string);
}
export type Token<T> = Type<T> | InjectToken | string;
export declare function getTokenName<T>(token: Token<T>): string;
