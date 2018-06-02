import React , { Component } from 'react';
import PropTypes from 'prop-types';
import AuthService from '../../auth/AuthService';

/**
 * This context allow to provide or consume an AuthService.
 */
const AuthContext = React.createContext(null);

/**
 * This react component is a shortcut to provide authService to React component.
 * It is useful cause it handles the component lifecycle and update only when needed.
 * Under the hood it is just a react context provider.
 * 
 * @export
 * @class AuthServiceProvider
 * @extends {Component}
 */
export class AuthServiceProvider extends Component {

    state = {}

    static cloneAuthService(authService){
        // Force consumer to render, see https://reactjs.org/docs/context.html#caveats
        return Object.assign(Object.create(authService), authService);
    }
    
    static getDerivedStateFromProps(props, state){
        return { authService : AuthServiceProvider.cloneAuthService(props.authService) };
    }

    componentDidMount() {
        this.unsubscribe = this.props.authService.onAuthStateChanged(() => {
            this.setState({ authService : AuthServiceProvider.cloneAuthService(this.props.authService) })
        });
    }
    
    componentWillUnmount() {
        this.unsubscribe();
    }
    
    render(){
        return (
        <AuthContext.Provider value={this.state.authService}>
           {this.props.children}
        </AuthContext.Provider>
        );
    }
}

AuthServiceProvider.propTypes = {
    /**
     * The authService you want to provide to React component below
     */
    authService : PropTypes.instanceOf(AuthService).isRequired
}

/**
 * This component allow to consume AuthService. Under the hood it is just a react context consumer.
 */
export const AuthServiceConsumer = AuthContext.Consumer;