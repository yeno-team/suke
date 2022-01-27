/**
 * Tests Name Class
 * 
 * @group unit/classes/name
 */

import { PropertyValidationError, ValidationError } from "../../exceptions/ValidationError";
import { Name } from "./Name";

describe("Name class", () => {
    describe("#constructor", () => {
        it('should throw ValidationError if name is not a valid name', () => {
            expect(() => {new Name("");}).toThrow(ValidationError);
            expect(() => {new Name("_username");}).toThrow(ValidationError);
            expect(() => {new Name("abc");}).toThrow(ValidationError);
            expect(() => {new Name("_20.");}).toThrow(ValidationError);
            expect(() => {new Name("user_.name");}).toThrow(ValidationError);
        });

        it('should throw PropertyValidationError if passed a non-string', () => {
            expect(() => {new Name(1 as unknown as string);}).toThrow(PropertyValidationError);
        });

        it('should not throw any errors if passed a correct name', () => {
            expect(() => {new Name("user");}).not.toThrow(ValidationError);
            expect(() => {new Name("user_d");}).not.toThrow(ValidationError);
            expect(() => {new Name("user.guy");}).not.toThrow(ValidationError);
        });
    });

    describe('#Equals', () => {
        it('should return true if passed in matching objects', () => {
            const name = new Name('username');

            expect(name.Equals(name)).toBeTruthy();
        });

        it('should return false if passed in non-matching objects', () => {
            const name = new Name('username');
            const name2 = new Name('username2');

            expect(name.Equals(name2)).toBeFalsy();
        });
    });
});