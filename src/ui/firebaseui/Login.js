import React, { Component } from 'react';
import firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

const ELEMENT_ID = "firebaseui-auth-container";

// Props type for firebase and config

class Login extends Component {

    constructor(props){
        super(props);
        this.ui = new firebaseui.auth.AuthUI(this.props.firebase.auth());
    }

    componentDidMount(){
        this.ui.start(`#${ELEMENT_ID}`, this.props.config);
    }

    render() {
        return (
            <div id={ELEMENT_ID}/>
        );
    }

}

export default Login;