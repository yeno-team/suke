/**
 * Tests ValueObject Class
 * 
 * @group unit/classes/valueObject
 */

import { MockValueObject } from "./mocks/MockValueObject";

describe("ValueObject class", () => {
    describe('#Equals', () => {
        it('should return true if passed matching objects', () => {
            const mock = new MockValueObject('2');

            expect(mock.Equals(mock)).toBe(true);
        });

        it('should return false if passed non-matching objects', () => {
            const mock1 = new MockValueObject('2');
            const mock2 = new MockValueObject('3');

            expect(mock1.Equals(mock2)).toBe(false);
        });

        it('should returnm false if passed an instance that is not a ValueObject', () => {
            const mock = new MockValueObject('');

            expect(mock.Equals({})).toBe(false);
        });
    });
});