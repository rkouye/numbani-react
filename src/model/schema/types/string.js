import { Type } from "./Type";
import ValidationError from "./ValidationError";

function emptyValue(value){
    return (value===null || value===undefined);
}

function validString(value){
    return (emptyValue(value) || typeof value === "string");
}

const string = new Type().extendWithValidators(
    value => validString(value)?[]:[new ValidationError("numbani:validations.string.invalidType", {value})]
);

string.max = function(length){
    const newType = this.extendWithValidators(
        value => (emptyValue(value) || (validString(value) && value.length<=length))?
        []:[new ValidationError("numbani:validations.string.invalidMaxLength", {value, expected : length, actual : value.length})]
    );
    newType.addInfo("string.max", Math.min(newType.getInfo("string.max") || Number.POSITIVE_INFINITY , length));
    return newType;
}

string.min = function(length){
    const newType = this.extendWithValidators(
        value => (emptyValue(value) || (validString(value) && value.length>=length))?
        []:[new ValidationError("numbani:validations.string.invalidMinLength", {value, expected : length, actual : value.length})]
    );
    newType.addInfo("string.min", Math.max(newType.getInfo("string.min") || Number.NEGATIVE_INFINITY , length));
    return newType;
}

export default string;