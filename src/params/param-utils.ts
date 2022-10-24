import { Command } from "../command";
import { Param, SupportedTypes, SupportedTypesWithArray } from "./Param";

/**
 * Maps raw results into an array of types supported by the command generator.
 * @param result Raw type received in the {@link cmd} function.
 */
export const mapResult = (result: SupportedTypesWithArray): SupportedTypes[] => {
    if (Array.isArray(result)) return result.flatMap(mapResult);
    else if (result instanceof Param) return result.getVariations();
    // TODO: Think about this - should nested command be evaluated in place or passed to the generator?
    else if (result instanceof Command) return result.getVariations();
    else return [String(result)];
}

export const calculateVariationCount = (result: SupportedTypesWithArray): number => {
    if (Array.isArray(result)) return result.flatMap(calculateVariationCount).reduce((a, b) => a + b, 0);
    else if (result instanceof Param) return result.variationCount;
    else if (result instanceof Command) return result.variationCount;
    else return 1;
};
