import { ValidationError } from "../../exceptions/ValidationError";
import { ValueObject } from "../../ValueObject";
interface IEmoji {
    url : URL;
    id : number;
    name : string;
    type : "global" | "channel";
}
export abstract class BaseEmoji extends ValueObject {
    abstract toString() : string;
}

export class Emoji extends BaseEmoji implements IEmoji {
    public url: URL;
    public id: number;
    public name: string;
    public type : "global" | "channel";

    
    constructor(_IEmoji : IEmoji) {
        super();
        this.url = _IEmoji.url;
        this.id = _IEmoji.id;
        this.type = _IEmoji.type;
        this.name = `:${_IEmoji.name}:`;

        this.IsValid()
    }

    public toString(): string {
        return JSON.stringify({
            type : this.type,
            url : this.url,
            id : this.id,
            name : this.name
        })
    }

    public IsValid() : boolean {
        if(!(this.type)) {
            throw new ValidationError("Type property must be required.")
        }
        
        if(this.type !== "global" && this.type !== "channel") {
            throw new ValidationError("Type property must be set as global or channel.")
        }

        if(!(this.url)) {
            throw new ValidationError("Url property must be required.")
        }

        if(!(this.url instanceof URL)) {
            throw new ValidationError("Url property must be an instance of the URL class.")
        }

        if(typeof (this.id) === "undefined") {
            throw new ValidationError("Id property must be required.")
        }

        if(!(this.name)) {
            throw new ValidationError("Name property must be required.")
        }

        return true
    }

    protected GetEqualityProperties(): Generator<unknown, unknown, unknown> {
        throw new Error("Method not implemented.");
    }
}