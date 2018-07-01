import { Type } from "./Type";
import ValidationError from "./ValidationError";

const array = new Type().extendWithValidators(
  value =>
     (value===null || value===undefined || Array.isArray(value))
      ? []
      : [new ValidationError("numbani:validations.array.invalidType", {value})]
);

export default array;
