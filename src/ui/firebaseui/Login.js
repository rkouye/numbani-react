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
     * An instance of firebaseui.
     */
    firebaseui : PropTypes.object.isRequired,
    /**
     * An instance of firebase.auth.Auth;
     * After importing firebase and firebase.auth you can get one by calling firebase.auth()
     */
    firebaseAuth : PropTypes.object.isRequired,
    /** 
     *  FirebaseUI config object. More information here : {@link https://github.com/firebase/firebaseui-web#configuration}
     */
    uiConfig : PropTypes.object.isRequired
};
export default Login;