import React, { Component } from 'react';
import PropTypes from 'prop-types';

const ELEMENT_ID = "firebaseui-auth-container";
/**
 * This component is just a react wrapper around firebaseui web auth componnent
 * 
 * @class Login
 * @extends {Component}
 */
class Login extends Component {

    constructor(props){
        super(props);
        const firebaseui = this.props.firebaseui;
        this.ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(this.props.firebaseAuth);
    }

    componentDidMount(){
        this.ui.start(`#${ELEMENT_ID}`, this.props.uiConfig);
    }

    render() {
        return (
            <div id={ELEMENT_ID}/>
        );
    }

}

Login.propTypes = {
    /**
     * This component require you to import your own firebaseui for localization purpose
     * Don't forget to import 'firebaseui/dist/firebaseui.css' if you want styling
     */
    firebaseui : PropTypes.object.isRequired,
    /**
     * instanceOf(firebase.auth.Auth)
     * Do firebase.auth()
     */
    firebaseAuth : PropTypes.object.isRequired,
    /** 
     *  See https://github.com/firebase/firebaseui-web#configuration
     */
    uiConfig : PropTypes.object.isRequired
};
export default Login;