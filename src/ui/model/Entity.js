import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EntityRepo from '../../model/core/EntityRepo';
import Async from 'react-promise';


export const EntityContext = React.createContext();
/**
 * 
 * @param {Component} Component 
 * @param {string} [propName = entityContext]
 */
export const injectEntityContext = (Component, propName) => props => (
    <EntityContext.Consumer>
    { entityContext =><Component {...props} {...{[propName || 'entityContext'] : entityContext}} /> }
    </EntityContext.Consumer>
);

const initialValidationInfo = {
    validationPromise : null,
    isValid : undefined,
    isValidating : undefined,
    validationErrorsCount : undefined,
    validationErrors : undefined
}

const initialSavingInfo = {
    savingPromise : null,
    isSaving : false,
    savingError : undefined,
    isSaved : false
}
class Entity extends Component {

    static getInitialState(repo, entityRef, defaultValue) {
        return {
            entityRef, //Just to compare on props change
            repo, // Just to compare on props change
            defaultValue, // Just to compare on props change

            editedValue : null,

            loadedValue : null,
            loadingPromise : null,

            ...initialValidationInfo,

            ...initialSavingInfo
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

    _loadData(repo, entityRef, defaultValue){
        if(this._loadingPromise){
            //TODO: Cancel here when repo request will be cancellable
        }
        const loadingPromise = entityRef?
        (defaultValue?repo.read(entityRef).catch(() => defaultValue):repo.read(entityRef))
        :
        (Promise.resolve(defaultValue));

        this.setState(prevState => ({loadingPromise}), ()=>{
            loadingPromise.then(loadedValue => {
                this.setState({loadedValue});
                this._loadingPromise = null;
            }).catch(ignore => {}); // Ignore here cause Async  already take care of it.
        });

    }

    _validateData(repo, value){
        if(this._validationPromise){
            //TODO: Cancel here (especially if we use backend validation)
        }
        const validationPromise = repo.validate(value);
        this.setState(prevState => ({validationPromise, isValidating : true}), ()=>{
            validationPromise.then( validationErrors => {
                let validationErrorsCount = 0;
                    for (let attribute in validationErrors) {
                    validationErrorsCount += validationErrors[attribute].length;
                }
                this.setState({
                    isValid : validationErrorsCount === 0,
                    validationErrorsCount,
                    isValidating : false,
                    validationErrors
                });
            });
        });
    }
    componentDidMount(){
        this._loadData(this.props.repo, this.props.entityRef, this.props.defaultValue);
    }

    componentDidUpdate(){
        if(this.state.loadingPromise === null){
            this._loadData(this.props.repo, this.props.entityRef, this.props.defaultValue);
        } else if(this.state.loadedValue !== null && this.state.validationPromise === null){
            this._validateData(this.props.repo, this.state.editedValue || this.state.loadedValue);
        }
    }

    componentWillUnmount(){
        if(this._loadingPromise){
            //TODO: Cancel here when repo request will be cancellable
        }
    }

    commands = {
        reload : ()=>{
            this.setState((prevState, props) => 
                Entity.getInitialState(props.repo, props.entityRef, props.defaultValue)
            );
        },
        reset : ()=>{
            this.setState({ editedValue : null});
        },
        merge : (newValue)=>{
            this.setState((prevState) => ({
                editedValue : {...(prevState.editedValue || prevState.loadedValue), ...newValue },
                ...initialValidationInfo,
                isSaved : false
            }));
        },
        set : (newValue)=>{
            this.setState({
                editedValue : newValue,
                ...initialValidationInfo,
                isSaved : false
            });
        },
        save : ()=>{
            if(!this.state.editedValue){
                console.warn("You tried to save although no edit have been made to the value. It is a noop, but it means something is wrong");
            } else {
                const savingPromise = this.props.repo.save(this.state.editedValue, this.props.entityRef);
                this.setState(prevState => ({savingPromise, isSaving : true}), ()=>{
                    savingPromise.then((ref)=>{
                        this.setState({...initialSavingInfo, isSaved : true});
                        if(typeof this.props.onSave === 'function') this.props.onSave(ref);
                    }).catch( error => {
                        this.setState({...initialSavingInfo, savingError : error});
                    });
                });
            }
        }
    };

    renderChildren = ({isLoading, loadingError, loadedValue}) => {
        return <EntityContext.Provider value={{ 
            repo : this.props.repo, 
            entityRef : this.props.entityRef,
            defaultValue : this.props.defaultValue,
            // Loading
            loadedValue,
            loadingPromise : this.state.loadingPromise,
            editedValue : this.state.editedValue,
            isLoading : !!isLoading,
            loadingError,
            // Validation
            isValid : this.state.isValid,
            validationErrors : this.state.validationErrors,
            isValidating : this.state.isValidating,
            validationErrorsCount : this.state.validationErrorsCount,
            // Saving
            savingPromise : this.state.savingPromise,
            isSaving : this.state.isSaving,
            savingError : this.state.savingError,
            isSaved : this.state.isSaved,
            // Command
            ...this.commands
        }}>
        {(typeof this.props.children === 'function')?
            this.props.children(
                this.state.editedValue || loadedValue,
                { 
                    isLoading : !!isLoading , loadingError, loadedValue, isDirty : !!this.state.editedValue,
                    // Validation
                    isValid : this.state.isValid, validationErrors : this.state.validationErrors, 
                    isValidating : this.state.isValidating, validationErrorsCount : this.state.validationErrorsCount,
                    // Saving
                    isSaving : this.state.isSaving,
                    savingError : this.state.savingError,
                    isSaved : this.state.isSaved

                },
                this.commands
            )
            :
            this.props.children
        }
        </EntityContext.Provider>
    }

    render() {
        return (
            this.state.loadingPromise?
            <Async
                promise={this.state.loadingPromise}
                then={this.renderPostLoading}
                catch={error => this.renderChildren({ isLoading : false, loadingError : error})}
                pending={() => this.renderChildren({ isLoading : true })}
            />
            : this.renderChildren({ isLoading : true })
        );
    }

    renderPostLoading= (loadedValue)=>{
        return(
            this.renderChildren({loadedValue})
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
     * { isLoading, loadingError, isValid, isValidating, validationErrors,validationErrorsCount, isSaving, savingErrors, isDirty, loadedValue},
     * { set, merge, reload, reset, save, delete })
    */
    children: PropTypes.func.isRequired,
    /** 
     * 
    */
   onSave : PropTypes.func
};

export default Entity;