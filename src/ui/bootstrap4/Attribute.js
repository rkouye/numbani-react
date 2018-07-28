import React, { Component } from 'react';
import { injectEntityContext } from '../model/Entity';
import PropTypes from 'prop-types';

import types, { Type } from '../../model/schema/types';
import { FormFeedback, Input, Label, FormGroup, Button, ListGroup, ListGroupItem } from 'reactstrap';
import NumericInput from 'react-numeric-input';

function renderValidationErrors(props) {
    return props.feedback?
    (
        (typeof props.feedback === 'function')?
        props.feedback(props.validationErrors).map(message => <FormFeedback style={{ display : "block"}} key={message}>{message}</FormFeedback>)
        :
        <FormFeedback style={{ display : "block"}}>{props.feedback}</FormFeedback>
    )
    :
    props.validationErrors.map( 
        error => 
        <FormFeedback style={{ display : "block"}} key={JSON.stringify(error)}>{error.display()}</FormFeedback>
    );
}

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
            const valueIsInvalid = this.state.dirty && this.props.validationErrors && this.props.validationErrors.length > 0;
            return (
                <React.Fragment>
                    {this.props.edit?
                        <React.Fragment>
                            <FormGroup>
                            {this.props.label && <Label>{this.props.label}</Label>}
                            <Input
                                type="text"
                                value={this.state.value}
                                onChange={this.handleChange}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                invalid={valueIsInvalid}
                            />
                            {valueIsInvalid && renderValidationErrors(this.props)}
                            </FormGroup>
                        </React.Fragment>
                        :<React.Fragment>
                            {this.props.label && <Label>{this.props.label}</Label>} {this.props.value || ""}
                        </React.Fragment>
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
function getControlBoolean(type){
    return class ControlString extends Component {
        constructor(props){
            super(props);
            this.state = { dirty : false, focused : false };
        }

        static getDerivedStateFromProps(props, state){
            if (!state.focused){
               return { value : (props.value || false) };
            } else return null;
        }

        handleChange = (event) => {
            this.setState({value : event.target.checked , dirty : true});
            this.props.onChange(event.target.checked);
        }

        handleFocus = (event) => {
            this.setState({ focused : true });
        }

        handleBlur = (event) => {
            this.setState({ focused : false, dirty : true });
        }

        render() {
            const valueIsInvalid = this.state.dirty && this.props.validationErrors && this.props.validationErrors.length > 0;
            return (
                <React.Fragment>
                    <FormGroup check>
                    <Label check>
                    <Input
                        type="checkbox"
                        checked={this.state.value}
                        disabled={!this.props.edit}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        invalid={valueIsInvalid}
                    />
                    {this.props.label}
                    </Label>
                    {valueIsInvalid && renderValidationErrors(this.props)}
                    </FormGroup>
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
            const valueIsInvalid = this.state.dirty && this.props.validationErrors && this.props.validationErrors.length > 0;
            return (
                <React.Fragment>
                {this.props.edit?
                <React.Fragment>
                    <FormGroup>
                    {this.props.label && <Label>{this.props.label}</Label>}
                    <NumericInput 
                        value={this.state.value}
                        onChange={this.handleChange}
                        className={`form-control ${valueIsInvalid?'is-invalid':''}`}/>
                    {valueIsInvalid && renderValidationErrors(this.props)}
                    </FormGroup>
                </React.Fragment>
                :<React.Fragment>
                    {this.props.label && <Label>{this.props.label}</Label>} {this.props.value || ""}
                </React.Fragment>
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
        
        constructor(props){
            super(props);
            this.state = { dirty : false};
        }

        change = (index) => (newValue) => {
            this.setState({dirty : true});
            this.props.onChange( this.props.value.map( (originalItem,itemIndex) => (index===itemIndex)?newValue:originalItem));
        }

        add = () => {
            this.setState({dirty : true});
            this.props.onChange([...(this.props.value || []), null])
        }

        remove = (index) => () => {
            this.setState({dirty : true});
            this.props.onChange(this.props.value.filter((val, pos) => pos!==index))
        }

        typeControlCache = []
        /**
         * @type {Array.<Type>}
         */
        typesCache = []

        render() {
            //TODO : Rewrite array validation. Pass down invalid element index in validationError.
            const valueIsInvalid = this.state.dirty && this.props.validationErrors && this.props.validationErrors.length > 0;
            return (
                <React.Fragment>
                    <FormGroup>
                    {this.props.label && <Label>{this.props.label}</Label>}
                    <ListGroup className={`${valueIsInvalid?"border border-danger rounded":""}`}>
                    {   this.props.value?
                        (this.props.value.map( (item, index) => {

                            if (!this.typeControlCache[index]){
                                for ( let itemType of type.getInfo("of") ){
                                    if( itemType.accepts(item)) {
                                        this.typeControlCache[index] = getControlForType(itemType);
                                        this.typesCache[index] =itemType;
                                        break;
                                    }
                                }
                                if(item === null || item === undefined){
                                    // First type is default :( , this is maybe some bad design, I guess
                                    this.typeControlCache[index] = getControlForType(type.getInfo("of")[0]);
                                    this.typesCache[index] = type.getInfo("of")[0];
                                }
                                //TODO : Check before if array is valid and display error instead
                                if(!this.typeControlCache[index]) throw new Error("UI Lib can't render array, no type accepts "+ item);
                            }

                            const TypeControl = this.typeControlCache[index];
                            const validationErrors = this.typesCache[index].getValidationErrors(item);
                            return <ListGroupItem key={index} className={`d-flex flex-row`}>
                            <div className="flex-fill">
                            <TypeControl
                                value={item}
                                edit={this.props.edit}
                                feedback={this.props.feedback}
                                onChange={this.change(index)}
                                validationErrors={validationErrors}
                            />
                            </div>
                            {this.props.edit && <Button
                                aria-label="Close"
                                className="align-self-start mx-2 font-weight-bold"
                                color="danger"
                                onClick={this.remove(index)}>&times;</Button>}
                            </ListGroupItem>
                        })
                    ) : null
                    }
                    { this.props.edit 
                     && !(type.getInfo('array.max') <= (this.props.value || []).length)
                     && <ListGroupItem>
                        <Button 
                            color="primary"
                            aria-label="Add"
                            className="font-weight-bold"
                            onClick={this.add}>+</Button>
                    </ListGroupItem>}
                </ListGroup>
                {valueIsInvalid && renderValidationErrors(this.props)}
                </FormGroup>
                </React.Fragment>
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
    else if(type.doExtends(types.Boolean))
        control = getControlBoolean(type);
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
            (eC.editedValue || eC.loadedValue)?
            <Control
                value={(eC.editedValue || eC.loadedValue)[this.props.name]}
                edit={this.props.edit}
                onChange={this.onChange}
                feedback={this.props.feedback}
                label={this.props.label}
                validationErrors={eC.validationErrors?eC.validationErrors[this.props.name]:[]}
            />
            : null
        );
    }
}

const Attribute = injectEntityContext(AttributeBase, 'entityContext');

Attribute.propTypes = {
    name : PropTypes.string.isRequired,
    edit : PropTypes.bool,
    label : PropTypes.string,
    feedback : PropTypes.oneOfType([PropTypes.string, PropTypes.func])
};

export default Attribute;