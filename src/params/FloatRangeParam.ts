import { Param } from './Param';

export class FloatRangeParam extends Param {
    readonly name = "FloatRange";

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
        return Math.floor((this.max - this.min + Math.abs(this.step)) / Math.abs(this.step));
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

export const floatRange = (min: number, max: number, step?: number): FloatRangeParam => {
    return new FloatRangeParam(min, max, step);
};
