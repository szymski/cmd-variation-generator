import { Param} from "./Param";
import { PrioritizedParam } from "./PrioritizedParam";

export class FromParamsParam extends Param implements PrioritizedParam {
    readonly name = "FromParams";
    readonly priority = 1_000;

    constructor(
        public readonly callback: (params: string[]) => string,
    ) {
        super();
    }

    getVariations(): FromParamsParam[] {
        return [this];
    }

    invoke(params: string[]): string {
        return this.callback(params);
    }

    get variationCount(): number {
        return 1;
    }

    get formattedInputs(): string {
        return this.callback.toString();
    }
}

export const fromParams = (callback: (params: string[]) => string): FromParamsParam => new FromParamsParam(callback);
