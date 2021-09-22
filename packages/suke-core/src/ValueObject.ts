export abstract class ValueObject {
    protected abstract GetEqualityProperties(): Generator<any>;

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