import { list } from "./ListParam";
import { mapResult } from "./param-utils";
import { cmd } from "../command";
import { buildMockParam } from "@test/test-utils";

describe("Param utils", () => {

    describe("mapResult", () => {

        it("should map ListParam of numbers to string array", () => {
            const given = list(1, 2, 3);
            const mapped = mapResult(given);
            expect(mapped).toEqual(["1", "2", "3"]);
        });

        it("should map string to string", () => {
            const given = "something";
            const mapped = mapResult(given);
            expect(mapped).toEqual(["something"]);
        });

        it("should map number to string", () => {
            const given = 1337;
            const mapped = mapResult(given);
            expect(mapped).toEqual(["1337"]);
        });

        it("should map array to string array", () => {
            const given = [1, "2", "three"];
            const mapped = mapResult(given);
            expect(mapped).toEqual(["1", "2", "three"]);
        });

        it("should map param to its variations", () => {
            const mockParam = buildMockParam({
                getVariationsMock: () => mapResult(["hello", 1]),
            });
            const mapped = mapResult(mockParam);

            expect(mapped).toEqual(["hello", "1"]);
        });

        it("should map 2 params recursively to its variations", () => {
            // given
            const mockParamInner = buildMockParam({
                getVariationsMock: () => mapResult([1000, "hello"]),
            });
            const mockParam = buildMockParam({
                getVariationsMock: () => mapResult(["hi", mockParamInner, "bye"]),
            });

            // when
            const mapped = mapResult(mockParam);

            // then
            expect(mapped).toEqual(["hi", "1000", "hello", "bye"]);
        });

        it("should map 3 params recursively to its variations", () => {
            // given
            const mockParamInner2 = buildMockParam({
                getVariationsMock: () => mapResult(2 + 3),
            });
            const mockParamInner = buildMockParam({
                getVariationsMock: () => mapResult([mockParamInner2, mockParamInner2]),
            });
            const mockParam = buildMockParam({
                getVariationsMock: () => mapResult(["hi", mockParamInner, "bye"]),
            });

            // when
            const mapped = mapResult(mockParam);

            // then
            expect(mapped).toEqual(["hi", "5", "5", "bye"]);
        });

        it("should map command param", () => {
            // given
            const mockCommand = cmd`I am a ${["mock", "command"]}`;
            const given = [1, mockCommand, 2];

            // when
            const mapped = mapResult(given);

            // then
            expect(mapped).toEqual(["1", "I am a mock", "I am a command", "2"]);
        });

    });

});
