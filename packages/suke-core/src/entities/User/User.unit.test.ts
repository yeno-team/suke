/**
 * Tests User Class
 * 
 * @group unit/classes/user
 */

import { ValidationError } from "../../exceptions/ValidationError"
import { Role } from "../../Role"
import { User } from "./User"

describe("User Class: Value Object", () => {
    describe('#constructor', () => {
        it('should throw a ValidationError if passed in obj type do not match', () => {
            expect(() => {new User({
                id: '' as unknown as number,
                name: 'username',
                email: 'da@gmail.com',
                role: Role.User,
                channel: {
                    id: 0,
                    followers: 0,
                    desc_title: '',
                    desc: '',
                    roledUsers: []
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
                    desc: '',
                    roledUsers: []
                }
            })}).toThrowError(ValidationError);

            expect(() => {new User({
                id: 1,
                name: 'username',
                email: 2 as unknown as string,
                role: Role.User,
                channel: {
                    id: 0,
                    followers: 0,
                    desc_title: '',
                    desc: '',
                    roledUsers: []
                }
            })}).toThrowError(ValidationError);


            expect(() => {new User({
                id: 1,
                name: 'username',
                email: 'da@gmail.com',
                role: '' as unknown as number,
                channel: {
                    id: 0,
                    followers: 0,
                    desc_title: '',
                    desc: '',
                    roledUsers: []
                }
            })}).toThrowError(ValidationError);
        });

        it('should throw ValidationError if email is not a valid email', () => {
            expect(() => {new User({
                id: 1,
                name: 'username',
                email: '',
                role: Role.User,
                channel: {
                    id: 0,
                    followers: 0,
                    desc_title: '',
                    desc: '',
                    roledUsers: []
                }
            })}).toThrowError(ValidationError);

            expect(() => {new User({
                id: 1,
                name: 'username',
                email: 'test@test',
                role: Role.User,
                channel: {
                    id: 0,
                    followers: 0,
                    desc_title: '',
                    desc: '',
                    roledUsers: []
                }
            })}).toThrowError(ValidationError);
        });

        it('should default to User role if passed in a null role', () => {
            const user = new User({
                id: 1,
                name: 'username',
                email: 'test@gmail.com',
                role: null as unknown as Role,
                channel: {
                    id: 0,
                    followers: 0,
                    desc_title: '',
                    desc: '',
                    roledUsers: []
                }
            });

            expect(user.role).toStrictEqual(Role.User);
        });

        it('should not throw a ValidationError if passed in valid User', () => {
            expect(() => {new User({
                id: 1,
                name: 'username',
                email: 'test@gmail.com',
                role: Role.User,
                channel: {
                    id: 0,
                    followers: 0,
                    desc_title: '',
                    desc: '',
                    roledUsers: []
                }
            })}).not.toThrow(ValidationError);
        });
    });

    describe("#Equals", () => {
        it('should return false if passed in non-matched objects', () => {
            const obj1 = new User({
                id: 1,
                name: 'username',
                email: 'da@gmail.com',
                role: 0,
                channel: {
                    id: 0,
                    followers: 0,
                    desc_title: '',
                    desc: '',
                    roledUsers: []
                }
            });

            const obj2 = new User({
                id: 2,
                name: 'username',
                email: 'da@gmail.com',
                role: 0,
                channel: {
                    id: 0,
                    followers: 0,
                    desc_title: '',
                    desc: '',
                    roledUsers: []
                }
            });

            expect(obj1.Equals(obj2)).toBeFalsy();
        });

        it('should return true if passed in matching objects', () => {
            const obj1 = new User({
                id: 1,
                name: 'username',
                email: 'da@gmail.com',
                role: 0,
                channel: {
                    id: 0,
                    followers: 0,
                    desc_title: '',
                    desc: '',
                    roledUsers: []
                }
            });

            const obj2 = new User({
                id: 1,
                name: 'username',
                email: 'da@gmail.com',
                role: 0,
                channel: {
                    id: 0,
                    followers: 0,
                    desc_title: '',
                    desc: '',
                    roledUsers: []
                }
            });

            expect(obj1.Equals(obj2)).toBeTruthy();
        });
    });
});
