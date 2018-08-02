import { Type } from "./Type";
import { makePredicate, isEmpty } from "./predicates";
import ValidationError from "./ValidationError";

const isNumber = makePredicate(value => typeof value === 'number' && isFinite(value));

const number = new Type().extendWithValidators(
  value =>
    isEmpty.or(isNumber)(value)
      ? []
      : [new ValidationError("numbani:validations.number.invalidType", {value})]
);

number.min = function(minValue){
  const newType = this.extendWithValidators(
      value => isEmpty.or(isNumber.and( n => n >= minValue))(value)?
      []:[new ValidationError("numbani:validations.number.invalidMinValue", {value, expected : minValue, actual : value})]
  );
  newType.addInfo("number.min", Math.max(newType.getInfo("number.min") || Number.NEGATIVE_INFINITY , minValue));
  return newType;
}

number.max = function(maxValue){
  const newType = this.extendWithValidators(
      value => isEmpty.or(isNumber.and( n => n <= maxValue))(value)?
      []:[new ValidationError("numbani:validations.number.invalidMaxValue", {value, expected : maxValue, actual : value})]
  );
  newType.addInfo("number.max", Math.min(newType.getInfo("number.max") || Number.POSITIVE_INFINITY  , maxValue));
  return newType;
}

export default number;