import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EntityRepo from '../../model/core/EntityRepo';
import Async from 'react-promise';


export const EntityContext = React.createContext();
/**
 * 
 * @param {Component} Component 
 * @param {string} propName 
 */
export const injectEntityContext = (Component, propName) => props => (
    <EntityContext.Consumer>
    { entityContext =><Component {...props} {...{[propName || 'entityContext'] : entityContext}} /> }
    </EntityContext.Consumer>
);

class Entity extends Component {

    static getInitialState(repo, entityRef, defaultValue) {
        const loadingPromise = entityRef?
        (defaultValue?repo.read(entityRef).catch(() => defaultValue):repo.read(entityRef))
        :
        (Promise.resolve(defaultValue));
        return {
            entityRef,
            repo,
            defaultValue,
            editedValue : null,
            loadingPromise
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.entityRef !== state.entityRef 
            || props.repo !== state.repo 
            || (!props.entityRef && (props.defaultValue !== state.defaultValue))
        )
        {
            if(state.editedValue) console.warn("Resetting state on an entity view with pending modification. Make sure this is really what you want to do.");
            return Entity.getInitialState(props.repo, props.entityRef, props.defaultValue);
        } else return null;
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    renderChildren = ({isLoading, loadingError, fetchedValue}) => {
        const commands = {
            reload : ()=>{
                this.setState((prevState, props) => 
                    Entity.getInitialState(props.repo, props.entityRef, props.defaultValue)
                );
            },
            merge : (newValue)=>{
                this.setState((prevState) => ({
                    editedValue : {...(prevState.editedValue || fetchedValue), ...newValue }
                }));
            },
            set : (newValue)=>{
                this.setState({ editedValue : newValue});
            }
        };

        return <EntityContext.Provider value={{ 
            repo : this.props.repo, 
            entityRef : this.props.entityRef,
            defaultValue : this.props.defaultValue,
            fetchedValue,
            editedValue : this.state.editedValue,
            isLoading : !!isLoading,
            loadingError,
            ...commands
        }}>
        {(typeof this.props.children === 'function')?
            this.props.children(
                this.state.editedValue || fetchedValue,
                { isLoading : !!isLoading , loadingError, fetchedValue, isDirty : !!this.state.editedValue},
                commands
            )
            :
            this.props.children
        }
        </EntityContext.Provider>
    }

    render() {
        return (
            <Async
                promise={this.state.loadingPromise}
                then={this.renderPostLoading}
                catch={error => this.renderChildren({ isLoading : false, loadingError : error})}
                pending={() => this.renderChildren({ isLoading : true })}
            />
        );
    }

    renderPostLoading= (fetchedValue)=>{
        return(
            this.renderChildren({fetchedValue})
        );
    }

}

Entity.propTypes = {
    /**
     * 
    */
    repo : PropTypes.instanceOf(EntityRepo).isRequired,
    /** 
     * 
    */
    entityRef : PropTypes.object,
    /** 
     * 
    */
    defaultValue : PropTypes.object,
    /**
     * (value,
     * { isLoading, loadingError, isValid, validationErrors, isSaving, savingErrors, isDirty, fetchedValue},
     * { set, reload, reset, save, delete })
    */
    children: PropTypes.func.isRequired
};

export default Entity;