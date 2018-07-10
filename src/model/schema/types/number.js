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

export default number;