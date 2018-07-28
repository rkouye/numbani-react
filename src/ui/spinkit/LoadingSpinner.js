import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectEntityContext } from '../model/Entity';
import Spinner from 'react-spinkit';

class LoadingSpinnerBase extends Component {
     render() {
        const ec = this.props.entityContext;
            return (ec.isLoading?
                <Spinner 
                    name={this.props.name}
                    color={this.props.color}
                    fadeIn={this.props.fadeIn}
                />:null);
    }
}

const LoadingSpinner = injectEntityContext(LoadingSpinnerBase);

LoadingSpinner.propTypes = {
    children : PropTypes.node
};

export default LoadingSpinner;