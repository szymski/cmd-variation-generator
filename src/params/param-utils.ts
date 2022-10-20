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

/// Variant 2 - each param has to call mapResult explicitly
export const mapResult_Variant_2 = (result: SupportedTypesWithArray): SupportedTypes[] => {
    if (Array.isArray(result)) return result.flatMap(mapResult);
    else if (result instanceof Param) return result.getVariations().map(mapResult).flat();
    else if (result instanceof Command) return [result];
    else return [String(result)];
}

export const calculateVarationCount = (result: SupportedTypesWithArray): number => {
    if (Array.isArray(result)) return result.flatMap(calculateVarationCount).reduce((a, b) => a * b, 1) * result.length;
    else if (result instanceof Param) return result.variationCount;
    else if (result instanceof Command) return result.variationCount;
    else return 1;
};
