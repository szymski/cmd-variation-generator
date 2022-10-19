import { Param } from './Param';

export class IntRangeParam extends Param {
    readonly name = "IntRange";

    readonly #reversed: boolean = false;

    /**
     * @param min Inclusive minimum integer value
     * @param max Inclusive maximum integer value
     * @param step How much to increment by
     */
    constructor(
        public readonly min: number,
        public readonly max: number,
        public readonly step: number = 1,
    ) {
        super();

        if (![min, max, step].every(Number.isInteger))
            throw Error("min, max and step parameters must be integers");

        if (step === 0) throw new Error("Step cannot be 0");

        // Reverse if min > max
        if (min > max) {
            this.#reversed = true;
            [this.min, this.max] = [this.max, this.min];

            if (step > 0) this.step *= -1;
        }

        if (step < 0 && !this.#reversed) throw new Error("Step cannot be negative when min < max");
    }

    get formattedInputs(): string {
        return `${this.min}-${this.max}` + (this.step !== 1 ? `, step=${this.step}` : "");
    }

    get variationCount(): number {
        return Math.ceil((this.max - this.min + 1) / Math.abs(this.step));
    }

    getVariations(): string[] {
        const count = this.variationCount;

        const assignValue: (_: any, idx: number) => any =
            !this.#reversed
                ? (_, idx) => this.min + idx * this.step
                : (_, idx) => this.max + idx * this.step;

        return [...new Array(count).keys()]
            .map(assignValue)
            .map(String);
    }
}

export const intRange = (min: number, max: number, step?: number): IntRangeParam => {
    return new IntRangeParam(min, max, step);
};
