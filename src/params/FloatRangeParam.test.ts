import { range } from "underscore";
import { floatRange } from "./FloatRangeParam";

describe("Params", () => {
    describe("FloatRangeParam", () => {
        it("should generate ascending sequence with step 1", () => {
            const given = floatRange(1.5, 10.5);

            const variations = given.getVariations();

            const expected = range(1.5, 11.5).map(String);
            expect(variations).toEqual(expected);
        });

        it("should generate ascending sequence with random step", () => {
            const given = floatRange(0, 20, 0.5);

            const variations = given.getVariations();

            const expected = range(0, 20.1, 0.5).map(String);
            expect(variations).toEqual(expected);
        });

        it("should generate desceding sequence with step -0.1", () => {
            const given = floatRange(1, 0, -0.1);

            const variations = given.getVariations()
                .map(x => Math.round(Number(x) * 10) / 10)
                .map(String);

            const expected = range(1, -0.1, -0.1)
                .map(x => Math.round(x * 10) / 10)
                .map(String);
            expect(variations).toEqual(expected);
        });

        it("should generate desceding sequence with custom step", () => {
            const given = floatRange(10, 1, -0.3);

            const variations = given.getVariations()
                .map(x => Math.round(Number(x) * 10) / 10)
                .map(String);

            const expected = range(10, 0.9, -0.3)
                .map(x => Math.round(Number(x) * 10) / 10)
                .map(String);
            expect(variations).toEqual(expected);
        });
    });
});
