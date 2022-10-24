import { Param } from "../params/Param";
import * as fs from "fs";

export class WordListParam extends Param {
    readonly name = "WordList";

    constructor(
        public lines: string[],
    )
    {
        super();
    }

    getVariations(): string[] {
        return this.lines;
    }

    get variationCount(): number {
        return this.lines.length;
    }

    get formattedInputs(): string {
        return `n=${this.lines.length}`;
    }
}

export class WordListFileParam extends WordListParam {
    constructor(
        public readonly filename: string,
    )
    {
        super([]);
        try {
            const loadedLines = fs.readFileSync(filename, "utf8")
                .replaceAll("\r", "")
                .split("\n")
                .filter(line => line);
            this.lines = loadedLines;
        }
        catch(e) {
            throw new Error(`Could not read file ${filename}: ${e}`);
        }
    }

    get formattedInputs(): string {
        return `"${this.filename}", n=${this.lines.length}`;
    }
}

export const wordlist = (linesOrFilename: string | string[]): WordListParam => {
    if (typeof linesOrFilename === "string") {
        return new WordListFileParam(linesOrFilename);
    }
    return new WordListParam(linesOrFilename);
};
