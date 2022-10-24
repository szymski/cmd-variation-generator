import { Param, SupportedTypes } from "@src/params";

export const buildMockParam = ({getVariationsMock}: { getVariationsMock: () => SupportedTypes[]; }): Param => new class extends Param {
    readonly name = "test";

    get formattedInputs(): string {
        return "hello";
    }

    getVariations = getVariationsMock;

    get variationCount(): number {
        return 1;
    }
};
