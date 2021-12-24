import { ValueObject } from "../../ValueObject";

export interface ISourceSearchQuery {
    query: string;
    source: string;
}

export class SourceSearchQuery extends ValueObject implements ISourceSearchQuery {
    query: string;
    source: string;

    protected *GetEqualityProperties(): Generator<unknown, unknown, unknown> {
        yield this.query;
        yield this.source;
        return;
    }

    protected IsValid(): boolean {
        throw new Error("Method not implemented.");
    }

}