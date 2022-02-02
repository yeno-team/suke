import { RateLimiterOpts } from "./RateLimiterOpts";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { ValidationError } from "../../exceptions/ValidationError";

const testLimiter = new RateLimiterRedis({ storeClient : "" });

const testOpts = {
    key : "amoung us",
    limiter : testLimiter
};
/**
 * Test RateLimiterOpts class
 */

describe("RateLimiterOpts class" , () => {
    describe("#constructor" , () => {
        it("should throw validation error if RateLimiterOpts is invalid" , () => {
            expect(() => new RateLimiterOpts({
                key : 1 as unknown as string,
                limiter : testLimiter
            })).toThrowError(ValidationError);

            expect(() => new RateLimiterOpts({
                key : "amoung us",
                limiter : "" as unknown as RateLimiterRedis
            })).toThrowError(ValidationError);

            expect(() => new RateLimiterOpts({
                ...testOpts,
                pointsToConsume : "1" as unknown as number
            })).toThrowError(ValidationError);

            expect(() => new RateLimiterOpts({
                ...testOpts,
                errorMessage: 1 as unknown as string
            })).toThrowError(ValidationError);

            expect(() => new RateLimiterOpts({
                ...testOpts,
                isGlobalLimiter : "true" as unknown as boolean
            })).toThrowError(ValidationError);

            expect(() => new RateLimiterOpts({
                key : "amoung us",
                limiter : testLimiter,
                setHeaders : "true" as unknown as boolean
            })).toThrowError(ValidationError);
        });

        it("should not throw validation error if RateLimiterOpts is valid." , () => {
            expect(() => new RateLimiterOpts({
                ...testOpts
            })).not.toThrowError(ValidationError);

            expect(() => new RateLimiterOpts({
                ...testOpts,
                pointsToConsume : 1
            })).not.toThrowError(ValidationError);

            expect(() => new RateLimiterOpts({
                ...testOpts,
                errorMessage : ""
            })).not.toThrowError(ValidationError);

            expect(() => new RateLimiterOpts({
                ...testOpts,
                isGlobalLimiter : true
            })).not.toThrowError(ValidationError);

            expect(() => new RateLimiterOpts({
                ...testOpts,
                setHeaders : true
            })).not.toThrowError(ValidationError);
        });
    });

    describe("#generator" , () => {
        it("should call generator function" , () => {
            const opts = new RateLimiterOpts({ 
                ...testOpts,
                pointsToConsume : 1,
                errorMessage : "test",
            });
            const generatorFunc = opts.GetEqualityProperties();
            
            expect(generatorFunc.next().value).toBe(opts.key);
            expect(generatorFunc.next().value).toBe(opts.limiter);
            expect(generatorFunc.next().value).toBe(opts.pointsToConsume);
            expect(generatorFunc.next().value).toBe(opts.errorMessage);
            expect(generatorFunc.next().value).toBe(opts.isGlobalLimiter);
            expect(generatorFunc.next().value).toBe(opts.setHeaders);
            expect(generatorFunc.next().done).toBeTruthy();


            // expect(opts.GetEqualityProperties().next().value).toBe(opts.limiter)

        });
    });
});