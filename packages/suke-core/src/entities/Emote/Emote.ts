import { ValidationError } from "../../exceptions/ValidationError";
import { IBaseEmoji } from "../../types/BaseEmoji";
import { ValueObject } from "../../ValueObject";

export interface IGlobalEmote extends IBaseEmoji {
    position : {
        x : number,
        y : number
    }
}

export abstract class BaseEmoji extends ValueObject {
    abstract toString() : string;
}

export class GlobalEmote extends BaseEmoji implements IGlobalEmote {
    public position: { x: number; y: number; };
    public type: "global";
    public url: URL;
    public id: number;
    public name: string;

    
    constructor(_IGlobalEmote : IGlobalEmote) {
        super();
        this.position = _IGlobalEmote.position;
        this.type = "global";
        this.url = _IGlobalEmote.url;
        this.id = _IGlobalEmote.id;
        this.name = `:${_IGlobalEmote.name}:`;

        this.IsValid()
    }

    public toString(): string {
        return JSON.stringify({
            position : this.position,
            type : this.type,
            url : this.url,
            id : this.id,
            name : this.name
        })
    }

    public IsValid() : boolean {
        if(!(this.url)) {
            throw new ValidationError("Url property must be required.")
        }

        if(!(this.url instanceof URL)) {
            throw new ValidationError("Url property must be an instance of the URL class.")
        }

        if(!(this.id)) {
            throw new ValidationError("Id property must be required.")
        }

        if(!(this.name)) {
            throw new ValidationError("Name property must be required.")
        }

        if(!(this.position)) {
            throw new ValidationError("Position property must be required.")
        }

        if(this.position && (typeof this.position.x !== "number" || typeof this.position.y !== "number")) {
            throw new ValidationError("Position property must contain valid x and y coordinates.")
        }

        return true
    }

    protected GetEqualityProperties(): Generator<unknown, unknown, unknown> {
        throw new Error("Method not implemented.");
    }
}