import { cmd, formatParam } from "./command";
import { intRange, list } from "./params";
import _ from "underscore";
import chalk from "chalk";

describe("Command", () => {

    describe("string and params decoupling", () => {
        it("should construct simple Command class using cmd", () => {
            const given = cmd`Hello there`;
            expect(given).toMatchObject({
                strings: ["Hello there"],
                params: [],
            });
        });

        it("should construct single param Command class using cmd", () => {
            const param = list("a", "b", "c");
            const given = cmd`Hello ${param}!`;

            expect(given).toMatchObject({
                strings: ["Hello ", "!"],
                params: [param],
            });
        });

        it("should construct two param Command class using cmd", () => {
            const param1 = list("a", "b", "c");
            const param2 = intRange(1, 10);
            const given = cmd`Hello ${param1}, it's been ${param2} days!`;

            expect(given).toMatchObject({
                strings: ["Hello ", ", it's been ", " days!"],
                params: [param1, param2],
            });
        });
    });

    describe("getExample", () => {
        it("should return single example", () => {
            const given = cmd`Hello there`;
            const example = given.getExample();
            expect(example).toBe("Hello there");
        });

        it("should return example with 1 param", () => {
            const given = cmd`Some number: ${intRange(1, 10)}`;
            const example = given.getExample();
            expect(example).toBe("Some number: 1");
        });

        it("should return example with 2 params", () => {
            const given = cmd`Some number: ${intRange(1, 10)} and ${["a", "b"]}`;
            const example = given.getExample();
            expect(example).toBe("Some number: 1 and a");
        });

        it("should return random example with 2 params", () => {
            // given
            const given = cmd`Some number: ${intRange(1, 10)} and ${["a", "b"]}`;

            // when
            const example = given.getExample(true);
            const split = example.match(/.+?([0-9]+).+([ab])$/)!
            const [, param1, param2] = split;

            // then
            expect(Number(param1)).toBeGreaterThanOrEqual(1);
            expect(Number(param1)).toBeLessThanOrEqual(10);
            expect(["a", "b"]).toContain(param2);
        });
    });

    describe("getVariations", () => {
        it("should return single variation", () => {
            const given = cmd`Hello there`;
            const variations = given.getVariations();
            expect(variations).toEqual([
                "Hello there",
            ]);
        });

        it("should return multiple variations with 1 param", () => {
            const given = cmd`Some number ${intRange(1, 10)}`;
            const variations = given.getVariations();
            expect(variations).toEqual([
                ..._.range(10)
                    .map(i => `Some number ${i + 1}`),
            ]);
        });

        it("should return multiple variations with 2 params", () => {
            const given = cmd`Some number ${intRange(1, 3)} and letter ${list("a", "b", "c")}`;
            const variations = given.getVariations();
            expect(variations).toEqual([
                ..._.range(3)
                    .flatMap(i => ["a", "b", "c"].map(char => `Some number ${i + 1} and letter ${char}`)),
            ]);
        });
    })

    describe("toString", () => {
        it("should return formatted command with 2 params", () => {
            // given
            const command = cmd`Some number ${intRange(1, 3)} and letter ${list("a", "b", "c")}`;
            const [param1, param2] = command.params;

            // when
            const str = command.toString();

            // then
            expect(str)
                .toBe(`${chalk.greenBright("Command: ")}` + chalk.white(`Some number ${formatParam(param1, 1)} and letter ${formatParam(param2, 0)}`));
        });
    })
});
