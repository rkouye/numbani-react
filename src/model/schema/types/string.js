import { Type } from "./Type";
import { makePredicate, isEmpty } from './predicates'
import ValidationError from "./ValidationError";

const isString = makePredicate(value =>  typeof value === "string");

const string = new Type().extendWithValidators(
    value => isEmpty.or(isString)(value)?[]:[new ValidationError("numbani:validations.string.invalidType", {value})]
);

string.max = function(length){
    const newType = this.extendWithValidators(
        value => isEmpty.or(isString.and(str => str.length <= length))(value)?
        []:[new ValidationError("numbani:validations.string.invalidMaxLength", {value, expected : length, actual : value.length})]
    );
    newType.addInfo("string.max", Math.min(newType.getInfo("string.max") || Number.POSITIVE_INFINITY , length));
    return newType;
}

string.min = function(length){
    const newType = this.extendWithValidators(
        value => isEmpty.or(isString.and(str => str.length >= length))(value)?
        []:[new ValidationError("numbani:validations.string.invalidMinLength", {value, expected : length, actual : value.length})]
    );
    newType.addInfo("string.min", Math.max(newType.getInfo("string.min") || Number.NEGATIVE_INFINITY , length));
    return newType;
}

export default string;