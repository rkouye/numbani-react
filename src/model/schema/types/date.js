import { Type } from "./Type";
import { makePredicate, isEmpty } from "./predicates";
import ValidationError from "./ValidationError";

const isDate = makePredicate(value => value instanceof Date);

const date = new Type().extendWithValidators(
  value =>
    isEmpty.or(isDate)(value)
      ? []
      : [new ValidationError("numbani:validations.date.invalidType", {value})]
);

export default date;