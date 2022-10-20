import { Command } from "../command";

export type SupportedTypes = string | number | Command | Param;
export type SupportedTypesWithArray = SupportedTypes | SupportedTypes[];

export abstract class Param {
    abstract get name(): string;

    abstract get formattedInputs(): string;

    abstract get variationCount(): number;

    abstract getVariations(): SupportedTypes[];
}

