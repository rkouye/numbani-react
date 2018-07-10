import { Type } from "./Type";
import { makePredicate, isEmpty } from "./predicates";
import ValidationError from "./ValidationError";

const isBool = makePredicate(value => typeof value === 'boolean');

const boolean = new Type().extendWithValidators(
  value =>
    isEmpty.or(isBool)(value)
      ? []
      : [new ValidationError("numbani:validations.boolean.invalidType", {value})]
);

export default boolean;