/**
 * Tests UserId Class
 * 
 * @group unit/classes/userId
 */

import { UserId } from ".";
import { ValidationError } from "../../exceptions/ValidationError";

describe('UserId class', () => {
    describe('#constructor', () => {
        it('should throw a ValidationError if passed a non-valid userId', () => {
            expect(() => {new UserId('' as unknown as number);}).toThrow(ValidationError);
            expect(() => {new UserId({} as unknown as number);}).toThrow(ValidationError);
            expect(() => {new UserId(true as unknown as number);}).toThrow(ValidationError);
        });

        it('should not throw an error if a valid userId is passed', () => {
            expect(() => {new UserId(1);}).not.toThrow(ValidationError);
        });

        it('should default to id -1 if passed in null id', () => {
            const user = new UserId(null as unknown as number);

            expect(user.value).toStrictEqual(-1);
        });
    });

    describe('#Equals', () => {
        it('should return true if passed in the same id', () => {
            const id = new UserId(1);

            expect(id.Equals(id)).toBeTruthy();
        });
        
        it('should return false if passed in the non-matching objects', () => {
            const id = new UserId(1);
            const id2 = new UserId(2);

            expect(id.Equals(id2)).toBeFalsy();
        });
    });

});
