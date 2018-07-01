import { Type } from "./Type";
import { makePredicate, isEmpty } from './predicates'
import ValidationError from "./ValidationError";

const isArray = makePredicate(Array.isArray);

const array = new Type().extendWithValidators(
  value =>
     isEmpty.or(isArray)(value)
      ? []
      : [new ValidationError("numbani:validations.array.invalidType", {value})]
);

export default array;
