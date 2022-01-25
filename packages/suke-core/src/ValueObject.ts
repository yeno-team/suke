import _ from "lodash";

export abstract class ValueObject {
    protected abstract GetEqualityProperties(): Generator<unknown, unknown, unknown>;
    /**
     * IsValid should be called in the constructor and should check the types of primitive values.
     * Objects passed in could come in from express request body object which is unknown.
     */
    protected abstract IsValid(): boolean;

    public Equals(obj: unknown): boolean {
        if (!(obj instanceof ValueObject)) return false;

        const objArr = Array.from(obj.GetEqualityProperties());
        const thisArr = Array.from(this.GetEqualityProperties());

        return objArr.every((val, i) => _.isEqual(val, thisArr[i]))
    }
}