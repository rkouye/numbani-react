import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AuthService from '../../auth/AuthService';

/**
 * This context allow to provide or consume an AuthService.
 */
const AuthContext = React.createContext(null);

function cloneAuthService(authService) {
    // Will force consumer to render, see https://reactjs.org/docs/context.html#caveats
    return Object.assign(Object.create(authService), authService);
}

/**
 * This react component is a shortcut to provide authService to React component.
 * It is useful cause it handles the component life cycle and update only when needed.
 * Under the hood it is just a react context provider.
 * 
 * @export
 */
export function AuthServiceProvider({ authService, children }) {

    const [value, setValue] = useState(() => cloneAuthService(authService));

    useEffect(() => {
        return authService.onAuthStateChanged(() => {
            setValue(cloneAuthService(authService));
        });
    }, [authService]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

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