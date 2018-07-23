import React, { Component } from 'react';
import * as RS from 'reactstrap';
import PropTypes from 'prop-types';
import { injectEntityContext } from '../model/Entity';

class ResetButtonBase extends Component {
    render() {
        const ec = this.props.entityContext;
        return (
            <RS.Button 
                disabled={!ec.editedValue || ec.isLoading} onClick={ec.reset}
                color="primary"
            >{this.props.children}</RS.Button>
        );
    }
}

const ResetButton = injectEntityContext(ResetButtonBase);

ResetButton.propTypes = {
    children : PropTypes.node
};

export default ResetButton;