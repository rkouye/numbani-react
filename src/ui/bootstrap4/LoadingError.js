import React, { Component } from 'react';
import { injectEntityContext } from '../model/Entity';
import { Alert } from 'reactstrap';

class LoadingErrorBase extends Component {
    render() {
        const eC = this.props.entityContext;
        return (
            (!eC.isLoading && eC.loadingError)?
            <Alert color="danger">{eC.loadingError.message || eC.loadingError.toString()}</Alert>
            : null
        );
    }
}

const LoadingError = injectEntityContext(LoadingErrorBase, 'entityContext');

export default LoadingError;