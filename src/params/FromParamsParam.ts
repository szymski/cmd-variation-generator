import { Param, SupportedTypes } from "./Param";
import { PrioritizedParam } from "./PrioritizedParam";
import { mapResult } from "../params/param-utils";

export class FromParamsParam extends Param implements PrioritizedParam {
    readonly name = "FromParams";
    readonly priority = 1_000;

    constructor(
        public readonly callback: (params: string[]) => SupportedTypes,
    ) {
        super();
    }

    getVariations(): FromParamsParam[] {
        return [this];
    }

    invoke(params: string[]): SupportedTypes[] {
        return mapResult(this.callback(params));
    }

    get variationCount(): number {
        return 1;
    }

    get formattedInputs(): string {
        return this.callback.toString();
    }
}

export const fromParams = (callback: (params: string[]) => SupportedTypes): FromParamsParam => new FromParamsParam(callback);
