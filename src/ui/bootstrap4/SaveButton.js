import React, { Component } from 'react';
import * as RS from 'reactstrap';
import PropTypes from 'prop-types';
import { injectEntityContext } from '../model/Entity';

class SaveButtonBase extends Component {
    render() {
        const ec = this.props.entityContext;
        return (
            <RS.Button 
                disabled={!ec.editedValue || ec.isSaving || !ec.isValid} onClick={ec.save}
                color="primary"
            >
                {this.props.children}
                {ec.isSaving && '...'}
                {ec.isSaved && ' ✔'}
            </RS.Button>
        );
    }
}

const SaveButton = injectEntityContext(SaveButtonBase);

SaveButton.propTypes = {
    children : PropTypes.node
};

export default SaveButton;