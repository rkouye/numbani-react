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
    constructor(){
        this.info = {};
    }
    /**
     *
     * Allow an instance of a more generic type to add aditionnal information that could be 
     * used by UI library to customize how the type is displayed
     * @param {String} name
     * @param {*} value
     * @memberof Type
     */
    addInfo(name, value){
        this.info[name] = value;
    }

    /**
     *
     * Allow an instance of a more generic type to add aditionnal information that could be 
     * used by UI library to customize how the type is displayed
     * @param {String} name
     * @returns
     * @memberof Type
     */
    getInfo(name){
        return this.info[name];
    }

    getValidationErrors(value){
        return [];
    }
    
    accepts(value){
        return (this.getValidationErrors(value).length === 0);
    }
    /**
     * Allow to build a new type by extending an existing one
     *
     * @param {*} validators
     * @returns
     * @memberof Type
     */
    extendWithValidators(...validators){
    
        const newType = Object.create(this);
        const that = this;

        newType.info = {...this.info};
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
