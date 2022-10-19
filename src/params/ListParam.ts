import { Param } from './Param';
import { Command } from "../command";

export class ListParam<T = any> extends Param {
    readonly name = "List";

    constructor(
        public readonly items: T[],
    ) {
        super();
    }

    get formattedInputs(): string {
        return this.items
            .map(this.formatItem)
            .join(",");
    }

    get variationCount(): number {
        return this.items
            .reduce((acc, item) => acc + (item instanceof Command ? item.variationCount : 1), 0);
    }

    getVariations(): (string | Command)[] {
        return this.items
            .map(item => item instanceof Command ? item : String(item));
    }

    protected formatItem(item: any): string {
        if (typeof item === "string") return `"${item}"`;
        if (item instanceof Command) return `Command(${item.toString()})`;
        return item.toString();
    }
}


export const list = <T = any>(first: T | Array<T>, ...items: T[]): ListParam<T> => {
    if(Array.isArray(first)) return new ListParam([...first, ...items]);
    return new ListParam([first, ...items]);
};
