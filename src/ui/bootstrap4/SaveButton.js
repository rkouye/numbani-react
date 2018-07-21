import React, { Component } from 'react';
import {Button} from 'reactstrap';
import PropTypes from 'prop-types';
import { injectEntityContext } from '../model/Entity';

class SaveButtonBase extends Component {
    render() {
        const ec = this.props.entityContext;
        return (
            <Button 
                disabled={!ec.editedValue || ec.isSaving || !ec.isValid} onClick={ec.save}
                color="primary"
            >{this.props.children}</Button>
        );
    }
}

const SaveButton = injectEntityContext(SaveButtonBase);

SaveButton.propTypes = {
    children : PropTypes.node
};

export default SaveButton;