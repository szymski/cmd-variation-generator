import { Param } from "./Param";
import { Command } from "../command";
import { calculateVariationCount, mapResult } from "./param-utils";

type SupportedTypes = string | number | Command | Param;
type SupportedTypesWithArray = SupportedTypes | SupportedTypes[];

export class CallbackParam extends Param {
    readonly name = "CallbackParam";

    constructor(
        public readonly callback: (...params: any[]) => SupportedTypesWithArray,
    ) {
        super();
    }

    getVariations(): SupportedTypes[] {
        const result = this.callback();
        return mapResult(result);
    }

    get variationCount(): number {
        return calculateVariationCount(this.callback());
    }

    get formattedInputs(): string {
        return this.callback.toString();
    }

}

export const callback = (callback: () => SupportedTypesWithArray): CallbackParam => new CallbackParam(callback);
