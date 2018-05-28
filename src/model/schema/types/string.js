import { Type } from "./Type";
import ValidationError from "./ValidationError";
import i18n from "i18next";

function emptyValue(value){
    return (value===null || value===undefined);
}

function validString(value){
    return (emptyValue(value) || typeof value === "string");
}

const string = new Type().extendWithValidators(
    value => validString(value)?[]:[new ValidationError(i18n.t("numbani:validations.string.invalidType", {value}))]
);

string.max = function(length){
    return this.extendWithValidators(
        value => (emptyValue(value) || (validString(value) && value.length<=length))?
        []:[new ValidationError(i18n.t("numbani:validations.string.invalidLength", {value, expected : length, actual : value.length}))]
    );
}

export default string;