import { Type } from "./Type";
import { makePredicate, isEmpty } from "./predicates";
import ValidationError from "./ValidationError";

const isArray = makePredicate(Array.isArray);

/**
 * @typedef ArrayType
 * @property {(...types : Type[]) => ArrayType} of
 */

 /**
  * @type {Type & ArrayType}
  */
const array = new Type().extendWithValidators(
  value =>
    isEmpty.or(isArray)(value)
      ? []
      : [new ValidationError("numbani:validations.array.invalidType", {value})]
);

/**
 * 
 * @param {Array.<Type>} types
 */
array.of = function(...types) {
  const newType = this.extendWithValidators(
    value =>
      isEmpty.or(
        isArray.and(value =>
          value.every(element => types.some(type => type.accepts(element)))
        )
      )(value)
        ? []
        : [new ValidationError("numbani:validations.array.invalidElementType", {value, types})]
  );
  newType.addInfo("of", types);
  return newType;
};

array.max = function(length){
  const newType = this.extendWithValidators(
      value => isEmpty.or(isArray.and(arr => arr.length <= length))(value)?
      []:[new ValidationError("numbani:validations.array.invalidMaxLength", {value, expected : length, actual : value.length})]
  );
  newType.addInfo("array.max", Math.min(newType.getInfo("array.max") || Number.POSITIVE_INFINITY , length));
  return newType;
}

array.min = function(length){
  const newType = this.extendWithValidators(
      value => isEmpty.or(isArray.and(arr => arr.length >= length))(value)?
      []:[new ValidationError("numbani:validations.array.invalidMinLength", {value, expected : length, actual : value.length})]
  );
  newType.addInfo("array.min", Math.max(newType.getInfo("array.min") || Number.NEGATIVE_INFINITY , length));
  return newType;
}

export default array;
