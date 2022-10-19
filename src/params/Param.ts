import { Command } from "../command";

export abstract class Param {
    abstract get name(): string;

    abstract get formattedInputs(): string;

    abstract get variationCount(): number;

    abstract getVariations(): (string | Command | Param)[];
}

