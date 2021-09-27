/**
 * Tests User Class
 * 
 * @group unit/classes/user
 */

import { ValidationError } from "../exceptions/ValidationError"
import { Role } from "../Role"
import { User } from "./User"

describe("User Class: Value Object", () => {
    describe('#constructor', () => {
        it('should throw a ValidationError if passed in obj type do not match', () => {
            expect(() => {new User({
                id: '' as unknown as number,
                name: '',
                email: '',
                password: '',
                salt: '',
                role: Role.User
            })}).toThrowError(ValidationError);

            expect(() => {new User({
                id: 1,
                name: 2 as unknown as string,
                email: '',
                password: '',
                salt: '',
                role: Role.User
            })}).toThrowError(ValidationError);

            expect(() => {new User({
                id: 1,
                name: '',
                email: 2 as unknown as string,
                password: '',
                salt: '',
                role: Role.User
            })}).toThrowError(ValidationError);

            expect(() => {new User({
                id: 1,
                name: '',
                email: '',
                password: 2 as unknown as string,
                salt: '',
                role: Role.User
            })}).toThrowError(ValidationError);

            expect(() => {new User({
                id: 1,
                name: '',
                email: '',
                password: '',
                salt: 2 as unknown as string,
                role: Role.User
            })}).toThrowError(ValidationError);

            expect(() => {new User({
                id: 1,
                name: '',
                email: '',
                password: '',
                salt: '',
                role: '' as unknown as number
            })}).toThrowError(ValidationError);
        })
    })
})