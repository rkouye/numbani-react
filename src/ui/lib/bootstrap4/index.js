import types from '../../../model/schema/types';
import React, { Component } from 'react';
import PropsTypes from 'prop-types';
import Spinner from 'react-spinkit';
import { Alert, FormFeedback, Input, Button, ListGroup, ListGroupItem  } from 'reactstrap';
import './fix.css';

/**
 *
 *
 * @param {import("../../../model/schema/types").Type} type
 * @returns
 */
function getControlString(type){
    return class ControlString extends Component {
        constructor(props){
            super(props);
            this.state = { dirty : false };
        }

        handleChange = (event) => {
            this.props.onChange(event.target.value);
            this.setState({dirty : true});
        }

        render() {
            const valueIsValid = type.accepts(this.props.value);
            return (
                <React.Fragment>
                    {this.props.edit?
                        <React.Fragment>
                            <Input
                                type="text" 
                                value={this.props.value || ""}
                                onChange={this.handleChange}
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

function getControlArray(type){

    return class ControlArray extends Component {

        onChange = (index) => (newValue) => {
            this.props.onChange( this.props.value.map( (originalItem,itemIndex) => (index===itemIndex)?newValue:originalItem));
        }

        typeControlCache = []

        render() {
            return (
                <ListGroup>
                    {
                        this.props.value.map( (item, index) => {

                            if (!this.typeControlCache[index]){
                                for ( let itemType of type.getInfo("of") ){
                                    if( itemType.accepts(item)) {
                                        this.typeControlCache[index] = bootstrap4UiLib.getControlForType(itemType);
                                        break;
                                    }
                                }
                                //TODO : Check before if array is valid and display error instead
                                if(!this.typeControlCache[index]) throw new Error("UI Lib can't render array, no type accepts "+ item);
                            }

                            const TypeControl = this.typeControlCache[index]

                            return <ListGroupItem key={index}><TypeControl
                                value={item}
                                edit={this.props.edit}
                                onChange={this.onChange(index)}
                            /></ListGroupItem>
                        })
                    }
                    { this.props.edit && <ListGroupItem>
                        <Button color="primary" onClick={() => this.props.onChange([...this.props.value, null])}>+</Button>
                    </ListGroupItem>}
                </ListGroup>
            );
        }
    }
    
}
//TODO: Allow customisation of the spinner choosing the spinner
class InlineSpinner extends Component {
    render() {
        return (
            <Spinner name="three-bounce" overrideSpinnerClassName="numbani-uilib-inline-spinner"/>
        );
    }
}

class BootstrapAlertError extends Component {
    static propTypes = {
        error : PropsTypes.instanceOf(Error).isRequired,
        localize : PropsTypes.bool
    }

    render() {
        return (
            //TODO : Add localization
            <Alert color="danger">{this.props.error.message || this.props.error.toString()}</Alert>
        );
    }
}


class BootstrapActionButton extends Component {
    render() {
        return (
        <Button color="primary" disabled={this.props.disabled} onClick={this.props.onClick}>
            {this.props.children}
            {(this.props.busy)?<InlineSpinner/>:false}
        </Button>
        );
    }
}


const bootstrap4UiLib = {

    /**
     * 
     * @param {Type} type 
     */
    getControlForType(type){
        let control = null;

        if(type.doExtends(types.String))
            control = getControlString(type);
        if(type.doExtends(types.Array))
            control = getControlArray(type);
        if(control === null)
            throw new Error(`Type ${type.toString()} not supported in bootstrap ui lib`);
        return control;
    },

    InlineLoadingIndicatior : InlineSpinner,

    ActionButton : BootstrapActionButton,

    AlertError : BootstrapAlertError

};

export default bootstrap4UiLib;