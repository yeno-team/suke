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

        objArr.every((val, i) => {
            if (val !== thisArr[i]) {
                return false;
            }
        });

        return true;
    }
}