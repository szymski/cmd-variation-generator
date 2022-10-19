import { Param } from "./Param";

export interface PrioritizedParam {
    get priority(): number;
}

export namespace PrioritizedParam {
    export const isPrioritized = (param: Param | PrioritizedParam): param is PrioritizedParam => "priority" in param;
    export const getPriority = (param: Param | PrioritizedParam): number => isPrioritized(param) ? param.priority : 0;
    export const comparePriority = (...[a, b]: (Param | PrioritizedParam)[]): number => getPriority(a) - getPriority(b);
}

export const priority = (priority: number, param: Param): Param & PrioritizedParam =>
    Object.assign(param, { priority })
