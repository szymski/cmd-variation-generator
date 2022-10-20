import { intRange } from "./IntRangeParam";
import { range } from "underscore";

describe("Params", () => {
    describe("IntRangeParam", () => {
        it("should generate ascending sequence with step 1", () => {
            const given = intRange(1, 10);

            const variations = given.getVariations();

            const expected = range(1, 11).map(String);
            expect(variations).toEqual(expected);
        });

        it("should generate ascending sequence with random step", () => {
            const given = intRange(0, 20, 5);

            const variations = given.getVariations();

            const expected = range(0, 21, 5).map(String);
            expect(variations).toEqual(expected);
        });

        it("should generate desceding sequence with step 1", () => {
            const given = intRange(10, 1);

            const variations = given.getVariations();

            const expected = range(10, 0, -1).map(String);
            expect(variations).toEqual(expected);
        });

        it("should generate desceding sequence with custom step", () => {
            const given = intRange(10, 1, -3);

            const variations = given.getVariations();

            const expected = range(10, 0, -3).map(String);
            expect(variations).toEqual(expected);
        });

        it.each([
            [0.5, 1, 1],
            [1, 0.5, 1],
            [1, 1, 0.5],
            [0.9999, 0.9999, 0.9999],
        ])("should throw if non-integer numbers used (min %p, max %p, step %p)", (min, max, step) => {
            expect(() => {
                intRange(min, max, step);
            }).toThrow(Error);
        });
    });
});
