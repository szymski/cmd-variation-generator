import chalk from 'chalk';
import { FromParamsParam, list, Param, primitive, PrioritizedParam } from "./params";
import _ from "underscore";

type ParamPosHash = string;

const hashCodeOfParamPos = (param: Param, pos: number): ParamPosHash => {
    return `${param.name}#${pos}`;
};

export class Command {
    protected readonly paramPosToValueIndex: Record<number, number> = {};

    public readonly paramsOriginalPos: Param[];

    constructor(
        public readonly strings: string[],
        public readonly params: Param[],
    )
    {
        this.paramsOriginalPos = params.slice();

        const orgIndex = new Map<ParamPosHash, number>();
        this.params.forEach((param, index) => orgIndex.set(hashCodeOfParamPos(param, index), index));

        // console.log("Before priority sorting: " + this.params.map(formatParam).join(" "));
        const entries: [ParamPosHash, Param][] = params.map((param, index) => [hashCodeOfParamPos(param, index),
            param]);
        entries.sort(([hash1, param1], [hash2, param2]) => PrioritizedParam.comparePriority(param1, param2));
        entries.forEach(([hash, param], index) => {
            this.params[index] = param;
            this.paramPosToValueIndex[orgIndex.get(hash)!] = index;
        });
        // console.log("After priority sorting: " + this.params.map(formatParam).join(" "));
    }

    toString() {
        const formatted = this.strings.map((str, idx) => [str, this.params[this.paramPosToValueIndex[idx]] ?? undefined,
            this.paramPosToValueIndex[idx]])
            .reduce((acc,
                     [str, param, pos]) => acc + str + (param ? formatParam(param as Param, this.params.length - Number(pos) - 1) : ""), "");
        return chalk.greenBright("Command: ") + chalk.white(formatted);
    }

    get variationCount() {
        return this.params.reduce((acc, param) => acc * param.variationCount, 1);
    }

    * [Symbol.iterator]() {
        const count = this.variationCount;
        console.log(chalk.yellowBright(`Generating variations... Expected count is: ${count}`));

        const generator = new Generator(this.strings, this.params, this.paramPosToValueIndex, false);
        yield* generator;
    }

    getExample(random: boolean = false): string {
        const generator = new Generator(this.strings, this.params, this.paramPosToValueIndex, false);
        return generator.generateSingleVariation(random);
    }

    getVariations(reversed: boolean = false): string[] {
        const count = this.variationCount;
        console.log(chalk.yellowBright(`Generating variations... Expected count is: ${count}`));

        const generator = new Generator(this.strings, this.params, this.paramPosToValueIndex, reversed);
        const results = generator.generateAllVariations();

        return results;
    }
}

export const formatParam = (param: Param, pos: number) => {
    return chalk.greenBright(`#${pos}{${chalk.yellowBright(param.name)}${chalk.whiteBright("(")}${chalk.magenta(param.formattedInputs)}${chalk.whiteBright(")")}}`);
};

class Generator {
    public results: string[] = [];
    paramValues: string[] = [];
    #limit?: number;
    #random: boolean = false;

    constructor(
        protected readonly strings: string[],
        protected readonly params: Param[],
        protected readonly paramPosToValueIndex: Record<number, number>,
        protected readonly reversed: boolean = false,
        protected onGeneratedCallback?: (result: string) => void,
    )
    {
        if (reversed) {
            this.params = this.params.reverse();

            const indicesReversed = Object.values(this.paramPosToValueIndex).reverse();
            indicesReversed.forEach((val, i) => this.paramPosToValueIndex[i] = val);
        }
    }

    generateSingleVariation(random: boolean = false): string {
        this.results = [];
        this.paramValues = [];
        this.#limit = 1;
        this.#random = random;
        while (!this.generateVariations(this.params).next().done) {
        }
        return this.results[0];
    }

    generateAllVariations(): string[] {
        this.results = [];
        this.paramValues = [];
        this.#limit = undefined;
        this.#random = false;
        const generator = this.generateVariations(this.params);
        while (!generator.next().done) {
        }
        return this.results;
    }

    * [Symbol.iterator]() {
        const generator = this.generateVariations(this.params);
        yield* generator;
    }

    protected* generateVariations([param, ...otherParams]: Param[], paramIdx = 0): IterableIterator<string>
    {
        if (this.#limit && this.results.length >= this.#limit) return;

        if (!param) {
            const cmd = this.strings
                .map((str, idx) => [str, this.getParamValue(idx)])
                .reduce((acc, [str, param]) => acc + str + param, "");
            // console.log(chalk.red(`[depth: ${paramIdx}] No more params, adding to results: ${cmd}`));
            this.results.push(cmd);
            this.onGeneratedCallback?.(cmd);
            yield cmd;
            return;
        }

        // console.log(chalk.red(`[depth: ${paramIdx}] Generating variations for param #${paramIdx} (${param.name}) - param variation count: ${param.variationCount}`));
        for (const variation of (this.#random ? _.shuffle(param.getVariations()) : param.getVariations())) {
            if (variation instanceof Command) {
                const nestedVariations = variation.getVariations(this.reversed)
                for (const nested of nestedVariations) {
                    this.paramValues[paramIdx] = nested;
                    yield* this.generateVariations(otherParams, paramIdx + 1);
                }
            } else if (variation instanceof FromParamsParam) {
                const valueList = this.prepareParamList();
                const values = variation.invoke(valueList);
                // console.log(chalk.yellowBright(`Invoked FromParams callback: ${value}`));
                // for(const val of values) {
                //     if(val instanceof Param) {
                //         this.paramValues[paramIdx] = val;
                //         yield* this.generateVariations([val, ...otherParams], paramIdx);
                //     }
                // }
                yield* this.generateVariations(otherParams, paramIdx + 1);
            } else if (variation instanceof Param) {
                for (const nested of variation.getVariations()) {
                    if (nested instanceof Param) {
                        yield* this.generateVariations(otherParams, paramIdx + 1);
                    } else if (typeof nested === "string" || typeof nested === "number") {
                        this.paramValues[paramIdx] = String(nested);
                        yield* this.generateVariations(otherParams, paramIdx + 1);
                    } else {
                        throw new Error(`Unsupported variation type: ${typeof nested}`);
                    }
                    // this.paramValues[paramIdx] = nested;
                    // yield* this.generateVariations(otherParams, paramIdx + 1);
                }

                // throw new Error(`Param '${variation.name}' is not supported as a variation`);
            } else {
                this.paramValues[paramIdx] = String(variation);
                yield* this.generateVariations(otherParams, paramIdx + 1);
            }
        }
        // console.log(chalk.red(`[depth: ${paramIdx}] End generating variations for param #${paramIdx} (${param.name})`));
    }

    protected getParamValue(idx: number) {
        const pos = (this.reversed ? (this.params.length - idx - 1) : idx);
        const fixedIdx = this.paramPosToValueIndex[pos];
        if (this.reversed) return this.paramValues[this.params.length - fixedIdx - 1] ?? "";
        return this.paramValues[fixedIdx] ?? "";
    };

    protected prepareParamList(): string[] {
        const list: string[] = [];

        for (let i = 0; i < this.params.length; i++) {
            const fixedIdx = this.paramPosToValueIndex[i];
            const param = this.params[fixedIdx];
            if (param instanceof FromParamsParam) {
                // list[i] = "X";
                continue;
            }
            list[i] = this.paramValues[fixedIdx];
        }

        return list;
    }


}

export function cmd(strings: TemplateStringsArray, ...params: (Param | number | string | Command | Array<any>)[]) {
    const mappedParams = params.map(mapParam);
    return new Command(strings.slice(), mappedParams);
}

const mapParam = (param: Param | number | string | Command | Array<any>): Param => {
    if (param instanceof Param) return param;
    if (param instanceof Command) return primitive(param);
    if (typeof param === "number") return primitive(param);
    if (Array.isArray(param)) return list(param);
    return primitive(param);
}
