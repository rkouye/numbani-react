import React, { Component } from 'react';
import { injectEntityContext } from '../model/Entity';
import { Alert } from 'reactstrap';

class SavingErrorBase extends Component {
    render() {
        const eC = this.props.entityContext;
        return (
            (!eC.isSaving && eC.savingError)?
            <Alert color="danger">{eC.savingError.message || eC.savingError.toString()}</Alert>
            : null
        );
    }
}

const SavingError = injectEntityContext(SavingErrorBase, 'entityContext');

export default SavingError;