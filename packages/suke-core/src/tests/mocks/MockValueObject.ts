import { ValueObject } from "../../ValueObject";

export class MockValueObject extends ValueObject {
    value: string;

    constructor(val: string) {
        super();

        this.value = val;
    }

    protected *GetEqualityProperties(): Generator<unknown, unknown, unknown> {
        yield this.value;
        return;
    }

    protected IsValid(): boolean {
        throw new Error("Method not implemented.");
    }
}