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

const wrapLoadedValueWith = defaultValue => (value => {
    if(Array.isArray(value))
        console.warn("The value loaded in <Entity/> is an array, this is not supported by <Entity/>. You should use <Entities/> instead.");
    if(!value && !defaultValue) throw new Error("Entity doesn't exist");
    return ({ ...(defaultValue || {}), ...(value || {})});
});

const initialValidationInfo = {
    validationPromise : null,
    isValid : undefined,
    isValidating : true,
    validationErrorsCount : undefined,
    validationErrors : undefined
}

const initialSavingInfo = {
    savingPromise : null,
    isSaving : false,
    savingError : undefined,
    isSaved : false
}

const initialSyncInfo = {
    syncTimestamp : undefined,
    syncError : undefined
}
class Entity extends Component {

    static getInitialState({repo, entityRef, defaultValue, sync}) {
        return {
            entityRef, //Just to compare on props change
            repo, // Just to compare on props change
            defaultValue, // Just to compare on props change
            sync, // Just to compare on props change

            editedValue : null,

            loadedValue : null,
            loadingPromise : null,

            ...initialValidationInfo,

            ...initialSavingInfo,

            ...initialSyncInfo
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.entityRef !== state.entityRef 
            || props.repo !== state.repo 
            || props.sync !== state.sync //TODO: We can have performance optimization here : when true -> false : disable sync, false -> true : start it
            || (!props.entityRef && (props.defaultValue !== state.defaultValue))
        )
        {
            if(state.editedValue) console.warn("Resetting state on an entity view with pending modification. Make sure this is really what you want to do.");
            return Entity.getInitialState(props);
        } else return null;
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    _loadData(){
        
        const {repo, entityRef, defaultValue} = this.props;
        
        if(this._loadingPromise){
            //TODO: Cancel here when repo request will be cancellable
            this._loadingPromise = null;
        }
        const loadingPromise = entityRef?
        repo.read(entityRef).then(wrapLoadedValueWith(defaultValue))
        :(defaultValue?
            Promise.resolve(defaultValue)
            :
            Promise.reject(new Error("You should define at least an entityRef or a defaultValue on <Entity/>"))
        )
        this._loadingPromise = loadingPromise;

        this.setState(prevState => ({loadingPromise}), ()=>{
            loadingPromise.then(loadedValue => {
                if(this._loadingPromise===loadingPromise){
                    this.setState({loadedValue});
                    if(this.props.sync && entityRef){
                        this._startWatch()
                    }
                    this._loadingPromise = null;
                }
            }).catch(console.warn); // Just log here cause, Async will pass it to user.
        });
    }

    _startWatch(){
        const {repo, entityRef, defaultValue} = this.props;
        this._stopWatch = repo.watch(entityRef,
            changedValue => this.setState({
                loadedValue : wrapLoadedValueWith(defaultValue)(changedValue),
                syncTimestamp : new Date()}
            ),
            error => this.setState({ syncError : error})
        );
    }

    _validateData(){
        const {repo} = this.props;
        const value = this.state.editedValue || this.state.loadedValue;
        if(this._validationPromise){
            //TODO: Cancel here (especially if we use backend validation)
            this._validationPromise = null;
        }
        const validationPromise = repo.validate(value);
        this._validationPromise = validationPromise;
        this.setState(prevState => ({validationPromise, isValidating : true}), ()=>{
            validationPromise.then( validationErrors => {
                if(this._validationPromise===validationPromise){
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
                    this._validationPromise = null;
                }
            });
        });
    }
    componentDidMount(){
        this._loadData();
    }

    componentDidUpdate(){
        if(this.state.loadingPromise === null){
            this._loadData();
        } else if(this.state.loadedValue !== null && this.state.validationPromise === null){
            this._validateData();
        }
    }

    componentWillUnmount(){
        if(this._loadingPromise){
            //TODO: Cancel here when repo request will be cancellable
            this._loadingPromise = null;
        }
        if(this._validationPromise){
            //TODO: Cancel here (especially if we use backend validation)
            this._validationPromise = null;
        }
        if(this._stopWatch){
            this._stopWatch();
            this._stopWatch = null;
        }
    }

    commands = {
        reload : ()=>{
            this.setState((prevState, props) => 
                Entity.getInitialState(props)
            );
        },
        reset : ()=>{
            this.setState({ editedValue : null, ...initialValidationInfo});
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
            loadedValue : this.state.loadedValue || loadedValue,
            loadingPromise : this.state.loadingPromise,
            editedValue : this.state.editedValue,
            isLoading : !!isLoading,
            loadingError,
            // Sync
            syncTimestamp : this.state.syncTimestamp,
            syncError : this.state.syncError,
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
                this.state.editedValue || this.state.loadedValue || loadedValue,
                { 
                    isLoading : !!isLoading ,
                    loadingError, 
                    loadedValue : this.state.loadedValue || loadedValue,
                    isDirty : !!this.state.editedValue,
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
     * The EntityRepo where this entity belongs.
    */
    repo : PropTypes.instanceOf(EntityRepo).isRequired,
    /** 
     * The reference of the entity to display or edit. EntityRef are
     * specific to persistence provider.
    */
    entityRef : PropTypes.any,
    /** 
     * This value will be used if entityRef is not set or if it load 
     * an empty, or null or undefined value from the backend.
    */
    defaultValue : PropTypes.object,
    /**
     * Entity can take either anything that can be rendered or a function.
     * 
     * When it is a function, the function will take three parameters, the value loaded,
     * an object with information (isLoading, isValid...), 
     * and an object with commands (set, save...).
     * The function should return anything that can be rendered.
     * 
     * Entity also provide an EntityContext that is used by extensions.
    */
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    /** 
     * Callback called each time the value is saved.
    */
   onSave : PropTypes.func
};

export default Entity;