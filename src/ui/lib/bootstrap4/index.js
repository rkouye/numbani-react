import types from '../../../model/schema/types';
import React, { Component } from 'react';
import Spinner from 'react-spinkit';
import { Alert, FormFeedback, Input, Button } from 'reactstrap';
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
                                value={this.props.value}
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
//TODO: Allow customisation of the spinner choosing the spinner
class InlineSpinner extends Component {
    render() {
        return (
            <Spinner name="three-bounce" overrideSpinnerClassName="numbani-uilib-inline-spinner"/>
        );
    }
}

class BootstrapAlertError extends Component {
    render() {
        return (
            <Alert color="danger">{this.props.children}</Alert>
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
        
        if(control === null)
            throw new Error(`Type ${type.toString()} not supported in bootstrap ui lib`);
        return control;
    },

    InlineLoadingIndicatior : InlineSpinner,

    ActionButton : BootstrapActionButton,

    AlertError : BootstrapAlertError

};

export default bootstrap4UiLib;