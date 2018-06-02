import types from '../../../model/schema/types';
import React, { Component } from 'react';
import { Input } from 'reactstrap';

class ControlString extends Component {
    handleChange = (event) => {
        this.props.onChange(event.target.value);
    }
    render() {
        return (
            <React.Fragment>
                {this.props.edit?
                    <Input type="text" value={this.props.value} onChange={this.handleChange}/>
                    :
                    (this.props.value || "")
                }
            </React.Fragment>
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
            control = ControlString;
        
        if(control === null)
            throw new Error(`Type ${type.toString()} not supported in bootstrap ui lib`);
        return control;
    }

};

export default bootstrap4UiLib;