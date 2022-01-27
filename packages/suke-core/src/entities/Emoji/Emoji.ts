import { ValidationError } from "../../exceptions/ValidationError";
import { ValueObject } from "../../ValueObject";
export interface IBaseEmoji {
    id : string;
    name : string;
    type : "global" | "channel";
}

export interface IEmoji extends IBaseEmoji {
    url : URL
}
export class Emoji extends ValueObject implements IEmoji {
    public url: URL;
    public id: string;
    public name: string;
    public type : "global" | "channel";

    constructor(_IEmoji : IEmoji) {
        super();
        this.url = _IEmoji.url;
        this.id = _IEmoji.id;
        this.type = _IEmoji.type;
        this.name = `:${_IEmoji.name}:`;

        this.IsValid();
    }

    public IsValid() : boolean {
        if(!(this.type)) {
            throw new ValidationError("Type property must be required.");
        }

        if(typeof this.type !== "string") {
            throw new ValidationError("Type property must contain a string value.");
        }

        if(this.type !== "global" && this.type !== "channel") {
            throw new ValidationError("Type property must be set as global or channel.");
        }

        if(!(this.url)) {
            throw new ValidationError("Url property must be required.");
        }

        if(!(this.url instanceof URL)) {
            throw new ValidationError("Url property must be an instance of the URL class.");
        }

        if(typeof (this.id) === "undefined") {
            throw new ValidationError("Id property must be required.");
        }

        if(typeof this.id !== "string") {
            throw new ValidationError("Id property must be a string value.");
        }

        if(!(this.name)) {
            throw new ValidationError("Name property must be required.");
        }

        if(typeof this.name !== "string") {
            throw new ValidationError("Name property must contain a string value.");
        }

        return true;
    }

    protected GetEqualityProperties(): Generator<unknown, unknown, unknown> {
        throw new Error("Method not implemented.");
    }
}