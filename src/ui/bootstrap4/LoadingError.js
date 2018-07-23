import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectEntityContext } from '../model/Entity';
import { Alert } from 'reactstrap';

class LoadingErrorBase extends Component {
    render() {
        const eC = this.props.entityContext;
        return (
            (!eC.isLoading && eC.loadingError)?
            <Alert color="danger">{
                (typeof this.props.children === 'function')?
                this.props.children(eC.loadingError)
                :
                this.props.children || eC.loadingError.message || eC.loadingError.toString()
            }</Alert>
            : null
        );
    }
}

const LoadingError = injectEntityContext(LoadingErrorBase, 'entityContext');

LoadingError.propTypes = {
    /**
     * Either a React element to display or a function that take as parameter
     * the error and returns the message to display or nothing, in this case
     * the component will try do display the error anyway.
     */
    children : PropTypes.oneOfType([PropTypes.node, PropTypes.func])
};

export default LoadingError;