import React, { Component } from 'react';
import {Button} from 'reactstrap';
import PropTypes from 'prop-types';
import { injectEntityContext } from '../model/Entity';

class SaveButtonBase extends Component {
    render() {
        const {entityContext : ec, requireEdit} = this.props;
        return (
            <Button 
                disabled={ (!ec.editedValue && requireEdit) || ec.isSaving || !ec.isValid} onClick={ec.save}
                color="primary"
            >{this.props.children}</Button>
        );
    }
}

const SaveButton = injectEntityContext(SaveButtonBase);

SaveButton.propTypes = {
    children : PropTypes.node,
    requireEdit : PropTypes.bool
};

export default SaveButton;