import { Param, SupportedTypes, SupportedTypesWithArray } from "./Param";
import { mapResult } from "./param-utils";

export class PrimitiveLiteralParam extends Param {
    readonly name = "Primitive";
    readonly priority = 1_000;

    constructor(
        public readonly value: SupportedTypesWithArray,
    ) {
        super();
    }

    getVariations(): SupportedTypes[] {
        return mapResult(this.value);
    }

    get variationCount(): number {
        return 1;
    }

    get formattedInputs(): string {
        return mapResult(this.value).toString();
    }
}

export const primitive = (value: SupportedTypesWithArray): PrimitiveLiteralParam => new PrimitiveLiteralParam(value);
export const value = primitive;
