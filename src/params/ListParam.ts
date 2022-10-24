import { Param, SupportedTypes } from './Param';
import { Command } from "../command";
import { calculateVariationCount, mapResult } from "./param-utils";

export class ListParam extends Param {
    readonly name = "List";

    constructor(
        public readonly items: SupportedTypes[],
    ) {
        super();
    }

    get formattedInputs(): string {
        return this.items
            .map(this.formatItem)
            .join(",");
    }

    get variationCount(): number {
        return calculateVariationCount(this.items);
    }

    getVariations(): SupportedTypes[] {
        return mapResult(this.items);
    }

    protected formatItem(item: any): string {
        if (typeof item === "string") return `"${item}"`;
        if (item instanceof Command) return `Command(${item.toString()})`;
        return item.toString();
    }
}


export const list = <T extends SupportedTypes>(first: T | Array<T>, ...items: T[]): ListParam => {
    if(Array.isArray(first)) return new ListParam([...first, ...items]);
    return new ListParam([first, ...items]);
};
