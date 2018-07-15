import React, { Component } from 'react';
import { injectEntityContext } from '../model/Entity';
import PropTypes from 'prop-types';

import types, { Type } from '../../model/schema/types';
import { FormFeedback, Input, Button, ListGroup, ListGroupItem  } from 'reactstrap';
import NumericInput from 'react-numeric-input';

/**
 * @param {Type} type
 * @returns
 */
function getControlString(type){
    return class ControlString extends Component {
        constructor(props){
            super(props);
            this.state = { dirty : false, focused : false };
        }

        static getDerivedStateFromProps(props, state){
            if (!state.focused){
               return { value : (props.value || "") };
            } else return null;
        }

        handleChange = (event) => {
            this.setState({value : event.target.value , dirty : true});
            this.props.onChange(event.target.value);
        }

        handleFocus = (event) => {
            this.setState({ focused : true });
        }

        handleBlur = (event) => {
            this.setState({ focused : false, dirty : true });
        }

        render() {
            const valueIsValid = type.accepts(this.props.value);
            return (
                <React.Fragment>
                    {this.props.edit?
                        <React.Fragment>
                            <Input
                                type="text"
                                value={this.state.value}
                                onChange={this.handleChange}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                valid={this.state.dirty && valueIsValid}
                                invalid={this.state.dirty && !valueIsValid}
                            />
                            {valueIsValid ||
                            //TODO: Add localization
                                type.getValidationErrors(this.props.value).map( error => <FormFeedback key={JSON.stringify(error)}>{error.message}</FormFeedback> )
                            }
                        </React.Fragment>
                        :
                        (this.props.value || "")
                    }
                </React.Fragment>
            );
        }
    }
}
/**
 * @param {Type} type
 * @returns
 */
function getControlNumber(type){
    return class ControlNumber extends Component{
        constructor(props){
            super(props);
            this.state = { dirty : false};
        }

        static getDerivedStateFromProps(props){
            return { value : props.value };
        }

        handleChange = (value) => {
            this.setState({value , dirty : true});
            this.props.onChange(value);
        }
        render(){
            const valueIsValid = type.accepts(this.props.value);
            const inputValid = this.state.dirty && valueIsValid;
            const inputInvalid = this.state.dirty && !valueIsValid;
            return (
                <React.Fragment>
                {this.props.edit?
                <React.Fragment>
                    <NumericInput 
                        value={this.state.value}
                        onChange={this.handleChange}
                        className={`form-control ${inputValid?'is-valid':''} ${inputInvalid?'is-invalid':''}`}/>
                    {inputInvalid &&
                        //TODO: Add localization
                        type.getValidationErrors(this.props.value).map( error => <FormFeedback style={{ display : "block"}} key={JSON.stringify(error)}>{error.message}</FormFeedback> )
                    }
                </React.Fragment>
                :
                 (this.props.value || "")
                }
                </React.Fragment>
                
            );
        }
    }
}
/**
 * @param {Type} type
 * @returns
 */
function getControlArray(type){

    return class ControlArray extends Component {

        onChange = (index) => (newValue) => {
            this.props.onChange( this.props.value.map( (originalItem,itemIndex) => (index===itemIndex)?newValue:originalItem));
        }

        typeControlCache = []

        render() {
            return (
                <ListGroup>
                    {   this.props.value?
                        (this.props.value.map( (item, index) => {

                            if (!this.typeControlCache[index]){
                                for ( let itemType of type.getInfo("of") ){
                                    if( itemType.accepts(item)) {
                                        this.typeControlCache[index] = getControlForType(itemType);
                                        break;
                                    }
                                }
                                if(item === null || item === undefined){
                                    // First type is default :( , this is maybe some bad design, I guess
                                    this.typeControlCache[index] = getControlForType(type.getInfo("of")[0]);
                                }
                                //TODO : Check before if array is valid and display error instead
                                if(!this.typeControlCache[index]) throw new Error("UI Lib can't render array, no type accepts "+ item);
                            }

                            const TypeControl = this.typeControlCache[index]

                            return <ListGroupItem key={index} className="d-flex flex-row">
                            <div className="flex-fill">
                            <TypeControl
                                value={item}
                                edit={this.props.edit}
                                onChange={this.onChange(index)}
                            />
                            </div>
                            {this.props.edit && <Button
                                aria-label="Close"
                                className="align-self-start mx-2 font-weight-bold"
                                color="danger"
                                onClick={() => this.props.onChange(this.props.value.filter((val, pos) => pos!==index))}>&times;</Button>}
                            </ListGroupItem>
                        })
                    ) : null
                    }
                    { this.props.edit && <ListGroupItem>
                        <Button 
                            color="primary"
                            aria-label="Add"
                            className="mx-2 font-weight-bold"
                            onClick={() => this.props.onChange([...(this.props.value || []), null])}>+</Button>
                    </ListGroupItem>}
                </ListGroup>
            );
        }
    }
    
}

/**
 * 
 * @param {Type} type 
 */
function getControlForType(type){
    let control = null;

    if(!type) throw new Error("Attribute Type is "+type);

    if(type.doExtends(types.String))
        control = getControlString(type);
    else if(type.doExtends(types.Array))
        control = getControlArray(type);
    else if(type.doExtends(types.Number))
        control = getControlNumber(type);
    else throw new Error(`Type ${type.toString()} not supported in bootstrap ui lib`);
    return control;
}

class AttributeBase extends Component {
    constructor(props){
        super(props);
        this.state = {};
    }
    static getDerivedStateFromProps(props, prevState){
        if(!props.entityContext.repo.schema.typesMap[props.name]) 
            throw new Error(`Attribute ${props.name} is not defined in the entity schema`);

        return (props.name !== prevState.name || props.entityContext.repo !== prevState.repo  )?
        {
            control : getControlForType(props.entityContext.repo.schema.typesMap[props.name]),
            name : props.name,
            repo : props.entityContext.repo
        }:null;
    }

    onChange = (value) => {
        this.props.entityContext.merge({ [this.props.name] : value });
    }

    render() {
        const Control = this.state.control;
        const eC = this.props.entityContext;
        return (
            (eC.editedValue || eC.fetchedValue)?
            <Control
                value={(eC.editedValue || eC.fetchedValue)[this.props.name]}
                edit={this.props.edit}
                onChange={this.onChange}
            />
            : null
        );
    }
}

const Attribute = injectEntityContext(AttributeBase, 'entityContext');

Attribute.propTypes = {
    name : PropTypes.string.isRequired,
    edit : PropTypes.bool
};

export default Attribute;