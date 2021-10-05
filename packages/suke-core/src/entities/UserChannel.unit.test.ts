/**
 * Tests UserChannel Class
 * 
 * @group unit/classes/userChannel
 */

import { PropertyValidationError, ValidationError } from "../exceptions/ValidationError";
import { UserChannel } from "./UserChannel";

describe('UserChannel class', () => {
    describe('#constructor', () => {
        it('should throw ValidationError if channel object is not valid', () => {
            expect(() => {new UserChannel({
                id: -1,
                followers: '' as unknown as number,
                desc_title: '',
                desc: ''
            })}).toThrow(ValidationError);

            expect(() => {new UserChannel({
                id: 1,
                followers: '' as unknown as number,
                desc_title: '',
                desc: ''
            })}).toThrow(ValidationError);

            expect(() => {new UserChannel({
                id: 1,
                followers: 1,
                desc_title: '',
                desc: 1 as unknown as string
            })}).toThrow(ValidationError);
        });

        it('should not throw ValidationError if channel object is valid', () => {
            expect(() => {new UserChannel({
                id: 1,
                followers: 1,
                desc_title: '',
                desc: ''
            })}).not.toThrow(ValidationError);
        });

        it('should throw PropertyValidationError if a property is of a wrong type', () => {
            expect(() => {new UserChannel({
                id: 1,
                followers: '' as unknown as number,
                desc_title: '',
                desc: ''
            })}).toThrow(PropertyValidationError);

            expect(() => {new UserChannel({
                id: 1,
                followers: '' as unknown as number,
                desc_title: '',
                desc: ''
            })}).toThrow(PropertyValidationError);

            expect(() => {new UserChannel({
                id: 1,
                followers: 1,
                desc_title: 1 as unknown as string,
                desc: ''
            })}).toThrow(PropertyValidationError);

            expect(() => {new UserChannel({
                id: 1,
                followers: 1,
                desc_title: '',
                desc: 1 as unknown as string
            })}).toThrow(PropertyValidationError);
        });

        it('should change followers to 0 if passed in null', () => {
            const channel = new UserChannel({
                id: 1,
                followers: null as unknown as number,
                desc_title: '',
                desc: ''
            });

            expect(channel.followers).toStrictEqual(0);
        });

        it('should change desc_title to default if passed in a blank or null title', () => {
            const channel1 = new UserChannel({
                id: 1,
                followers: 1,
                desc_title: '',
                desc: ''
            });

            const channel2 = new UserChannel({
                id: 1,
                followers: 1,
                desc_title: null as unknown as string,
                desc: ''
            });

            expect(channel1.desc_title).toStrictEqual("About me");
            expect(channel2.desc_title).toStrictEqual("About me");
        });

        it('should change desc to default if passed in a blank or null description', () => {
            const channel1 = new UserChannel({
                id: 1,
                followers: 1,
                desc_title: '',
                desc: ''
            });

            const channel2 = new UserChannel({
                id: 1,
                followers: 1,
                desc_title: '',
                desc: null as unknown as string
            });

            expect(channel1.desc).toStrictEqual("Welcome to my channel!");
            expect(channel2.desc).toStrictEqual("Welcome to my channel!");
        });
    });

    describe('#Equals', () => {
        it('should return true if passed in matching channels', () => {
            const channel = new UserChannel({
                id: 1,
                followers: 1,
                desc_title: '',
                desc: ''
            });

            expect(channel.Equals(channel)).toBeTruthy();
        });

        it('should return false if passed in non-matching channels', () => {
            const channel = new UserChannel({
                id: 1,
                followers: 1,
                desc_title: '',
                desc: ''
            });

            const channel2 = new UserChannel({
                id: 1,
                followers: 5,
                desc_title: '',
                desc: ''
            });


            expect(channel.Equals(channel2)).toBeFalsy();
        });
    })
});