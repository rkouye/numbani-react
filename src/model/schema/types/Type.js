import ValidationError from "./ValidationError";
import i18n from "i18next";
/**
 * 
 * 
 * @export
 * @class Type
 */
// FIXME: Implement to string (and name)
 export class Type{

    /**
     * 
     * 
     * @param {any} value 
     * @returns {Array.<ValidationError>}
     * @memberof Type
     */
    getValidationErrors(value){
        return [];
    }
    
    accepts(value){
        return (this.getValidationErrors(value).length === 0);
    }
    
    extendWithValidators(...validators){
    
        const newType = Object.create(this);
        const that = this;

        newType.getValidationErrors = function(value){
            const errors = that.getValidationErrors(value);
            for(let validator of validators){
                errors.push(...validator(value));
            }
            return errors;
        }
        
        return newType;
    }

    doExtends(otherType){
        return otherType===this || otherType.isPrototypeOf(this);
    }
    
    required(){
        return this.extendWithValidators(
            value => (value !== null && value !== undefined)?
            []:[new ValidationError(i18n.t("numbani:validations.required", {value}))]
        );
    }

}
