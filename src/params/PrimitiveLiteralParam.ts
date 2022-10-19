import { Param} from "./Param";
import { Command } from "../command";

type SupportedTypes = string | number | Command;

export class PrimitiveLiteralParam extends Param {
    readonly name = "Primitive";
    readonly priority = 1_000;

    constructor(
        public readonly value: SupportedTypes,
    ) {
        super();
    }

    getVariations(): (string | Command)[] {
        const mappedValue = this.mapValue(this.value);
        return [mappedValue];
    }

    get variationCount(): number {
        return 1;
    }

    get formattedInputs(): string {
        return this.mapValue(this.value).toString();
    }

    private mapValue(value: SupportedTypes): string | Command {
        if(value instanceof Command) return value;
        return String(value);
    }
}

export const primitive = (value: SupportedTypes): PrimitiveLiteralParam => new PrimitiveLiteralParam(value);
export const value = primitive;
