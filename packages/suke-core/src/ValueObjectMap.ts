import { ValueObject } from "./ValueObject";

export class ValueObjectMap<T extends ValueObject, V> extends Map<T, V> {
    public get(key: T): V | undefined {
        this.forEach((ws, id) => {
            if (id.Equals(key))
                return ws;
        });

        return undefined;
    }
}