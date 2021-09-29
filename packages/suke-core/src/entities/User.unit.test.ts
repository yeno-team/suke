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
                email: 'da@gmail.com',
                role: Role.User,
                channel: {
                    id: 0,
                    followers: 0,
                    desc_title: '',
                    desc: ''
                }
            })}).toThrowError(ValidationError);

            expect(() => {new User({
                id: 1,
                name: 2 as unknown as string,
                email: 'da@gmail.com',
                role: Role.User,
                channel: {
                    id: 0,
                    followers: 0,
                    desc_title: '',
                    desc: ''
                }
            })}).toThrowError(ValidationError);

            expect(() => {new User({
                id: 1,
                name: '',
                email: 2 as unknown as string,
                role: Role.User,
                channel: {
                    id: 0,
                    followers: 0,
                    desc_title: '',
                    desc: ''
                }
            })}).toThrowError(ValidationError);


            expect(() => {new User({
                id: 1,
                name: '',
                email: 'da@gmail.com',
                role: '' as unknown as number,
                channel: {
                    id: 0,
                    followers: 0,
                    desc_title: '',
                    desc: ''
                }
            })}).toThrowError(ValidationError);
        });

        it('should throw ValidationError if email is not a valid email', () => {
            expect(() => {new User({
                id: 1,
                name: '',
                email: '',
                role: Role.User,
                channel: {
                    id: 0,
                    followers: 0,
                    desc_title: '',
                    desc: ''
                }
            })}).toThrowError(ValidationError);

            expect(() => {new User({
                id: 1,
                name: '',
                email: 'test@test',
                role: Role.User,
                channel: {
                    id: 0,
                    followers: 0,
                    desc_title: '',
                    desc: ''
                }
            })}).toThrowError(ValidationError);
        })
    });

    describe("#Equals", () => {
        it('should return false if passed in non-matched objects', () => {
            const obj1 = new User({
                id: 1,
                name: '',
                email: 'da@gmail.com',
                role: 0,
                channel: {
                    id: 0,
                    followers: 0,
                    desc_title: '',
                    desc: ''
                }
            });

            const obj2 = new User({
                id: 2,
                name: '',
                email: 'da@gmail.com',
                role: 0,
                channel: {
                    id: 0,
                    followers: 0,
                    desc_title: '',
                    desc: ''
                }
            });

            expect(obj1.Equals(obj2)).toBeFalsy();
        });

        it('should return true if passed in matching objects', () => {
            const obj1 = new User({
                id: 1,
                name: '',
                email: 'da@gmail.com',
                role: 0,
                channel: {
                    id: 0,
                    followers: 0,
                    desc_title: '',
                    desc: ''
                }
            });

            const obj2 = new User({
                id: 1,
                name: '',
                email: 'da@gmail.com',
                role: 0,
                channel: {
                    id: 0,
                    followers: 0,
                    desc_title: '',
                    desc: ''
                }
            });

            expect(obj1.Equals(obj2)).toBeTruthy();
        });
    })
})