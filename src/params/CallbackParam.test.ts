import { callback } from "./CallbackParam";
import { buildMockParam } from "@test/test-utils";

describe("Params", () => {
    describe("CallbackParam", () => {

        const mockParam = buildMockParam({
            getVariationsMock: () => ["hello there"],
        });

        const date = new Date();

        it.each(
            [
                [() => "hello", ["hello"]],
                [() => [1, 2 + 3, 3], ["1", "5", "3"]],
                [() => date.toLocaleString(), [date.toLocaleString()]],
                [() => mockParam, ["hello there"]],
            ]
        )("should return evaluated callback (%p) value equal to %p", (callbackFn: () => any, expected: any) => {
            // given
            const given = callback(callbackFn);

            // when
            const variations = given.getVariations();

            // then
            expect(variations).toEqual(expected);
        });
    });
});
