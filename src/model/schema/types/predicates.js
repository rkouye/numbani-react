/**
 * 
 * @param {(value : any) => boolean} test
 */
export const makePredicate = (test) => {

    const predicate = value => test(value);

    /**
     * 
     * @param {(value : any) => boolean} anotherTest 
     */
    predicate.and = (anotherTest) => makePredicate((value) => predicate(value) && anotherTest(value));

    /**
     * 
     * @param {(value : any) => boolean} anotherTest 
     */
    predicate.or = (anotherTest) => makePredicate((value) => predicate(value) || anotherTest(value));

    return predicate;
}

export const isEmpty = makePredicate( value => value === null || value === undefined);