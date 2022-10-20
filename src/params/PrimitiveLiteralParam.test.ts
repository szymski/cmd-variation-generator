import { primitive } from "./PrimitiveLiteralParam";
import { buildMockParam } from "@test/test-utils";

describe("Params", () => {
    describe("PrimitiveLiteralParam", () => {

        const mockParam = buildMockParam({
            getVariationsMock: () => ["hello", "there"],
        });

        it("should map number to string", () => {
            const given = primitive(5);
            const variations = given.getVariations();
            expect(variations).toEqual(["5"]);
        });

        it("should map string to string", () => {
            const given = primitive("xd");
            const variations = given.getVariations();
            expect(variations).toEqual(["xd"]);
        });

        it("should map array to strings", () => {
            const given = primitive([1, "2", "three"]);
            const variations = given.getVariations();
            expect(variations).toEqual(["1", "2", "three"]);
        });

        it("should map param to its variations", () => {
            const given = primitive(mockParam);
            const variations = given.getVariations();
            expect(variations).toEqual(["hello", "there"]);
        });
    });
});
