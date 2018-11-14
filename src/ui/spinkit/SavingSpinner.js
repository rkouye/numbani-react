import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectEntityContext } from '../model/Entity';
import Spinner from 'react-spinkit';

class SavingSpinnerBase extends Component {
     render() {
        const ec = this.props.entityContext;
            return (ec.isSaving?
                <Spinner 
                    name={this.props.name}
                    color={this.props.color}
                    fadeIn={this.props.fadeIn}
                />:null);
    }
}

const SavingSpinner = injectEntityContext(SavingSpinnerBase);

SavingSpinner.propTypes = {
    children : PropTypes.node
};

export default SavingSpinner;