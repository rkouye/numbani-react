import React , { Component } from 'react';
/**
 * This context allow to provide or consume an AuthService.
 */
const AuthContext = React.createContext(null);

export default AuthContext;

export class AuthServiceProvider extends Component {
    
    constructor(props){
        super(props);
        //TODO: Add propstypes to check if authService is an instance of AuthService from model
    }

    componentDidMount() {
        this.unsubscribe = this.props.authService.onAuthStateChanged(this.forceUpdate);
    }
    
    componentWillUnmount() {
        this.unsubscribe();
    }
    
    render(){
        return (
        <AuthContext.Provider value={this.props.authService}>
           {this.props.children}
        </AuthContext.Provider>
        );
    }
}