import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';
import { injectEntityContext } from '../model/Entity';

class SavedAlertBase extends Component {
     render() {
        const ec = this.props.entityContext;
            return (
                ec.isSaved?<Alert color="success">
                    {this.props.children}
                </Alert>:null
            );
    }
}

const SavedAlert = injectEntityContext(SavedAlertBase);

SavedAlert.propTypes = {
    children : PropTypes.node
};

export default SavedAlert;