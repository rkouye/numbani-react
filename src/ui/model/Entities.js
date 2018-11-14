import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Async from 'react-promise';
import {EntityContext} from './Entity';

const wrapLoadedValuesWith = defaultList => (values => {
    if(!values && !defaultList) throw new Error("Entity list is "+values);
    if(!Array.isArray(values || defaultList))
        throw new Error("Entity list is expected to be an array");
    return values || defaultList;
});

class Entities extends Component {

    static getInitialState({repo, entitiesRef, defaultList, sync}) {
        return {
            entitiesRef, //Just to compare on props change
            repo, // Just to compare on props change
            defaultList, // Just to compare on props change
            sync, // Just to compare on props change
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.entitiesRef !== state.entitiesRef 
            || props.repo !== state.repo 
            || props.sync !== state.sync //TODO: We can have performance optimization here by : when true -> false : disable sync, false -> true : start it
            || (!props.entitiesRef && (props.defaultList !== state.defaultList))
        )
        {
            return Entities.getInitialState(props);
        } else return null;
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    _loadData(){
        const {repo, entitiesRef, defaultList} = this.props;
        if(this._loadingPromise){
            //TODO: Cancel here when repo request will be cancellable
            this._loadingPromise = null;
        }
        const loadingPromise = entitiesRef?
        repo.read(entitiesRef).then(wrapLoadedValuesWith(defaultList))
        :(defaultList?
            Promise.resolve(defaultList)
            :
            Promise.reject(new Error("You should define at least an entitiesRef or a defaultList on <Entities/>"))
        )
        this._loadingPromise = loadingPromise;

        this.setState(prevState => ({loadingPromise}), ()=>{
            loadingPromise.then(loadedValues => {
                if(this._loadingPromise===loadingPromise){
                    this.setState({loadedValues});
                    if(this.props.sync && entitiesRef){
                        this._startWatch()
                    }
                    this._loadingPromise = null;
                }
            }).catch(console.warn); // Just log here cause, Async will pass it to user.
        });

    }

    _startWatch(){
        const {repo, entitiesRef, defaultList} = this.props;
        this._stopWatch = repo.watch(entitiesRef,
            changedValues => this.setState({
                loadedValues : wrapLoadedValuesWith(defaultList)(changedValues),
                syncTimestamp : new Date()}
            ),
            error => this.setState({ syncError : error})
        );
    }

    componentDidMount(){
        this._loadData();
    }

    componentDidUpdate(){
        if(this.state.loadingPromise === null){
            this._loadData();
        }
    }

    componentWillUnmount(){
        if(this._loadingPromise){
            //TODO: Cancel here when repo request will be cancellable
            this._loadingPromise = null;
        }
        if(this._stopWatch){
            this._stopWatch();
            this._stopWatch = null;
        }
    }

    commands = {
        reload : ()=>{
            this.setState((prevState, props) => 
                Entities.getInitialState(props)
            );
        }
    };

    renderChildren = ({isLoading, loadingError, loadedValues}) => {
        return <EntityContext.Provider value={{ 
            repo : this.props.repo, 
            entitiesRef : this.props.entitiesRef,
            defaultList : this.props.defaultList,
            // Loading
            loadedValues : this.state.loadedValues || loadedValues,
            loadingPromise : this.state.loadingPromise,
            isLoading : !!isLoading,
            loadingError,
            // Sync
            syncTimestamp : this.state.syncTimestamp,
            syncError : this.state.syncError,
            // Command
            ...this.commands
        }}>
        {(typeof this.props.children === 'function')?
            this.props.children(
                this.state.loadedValues || loadedValues,
                { 
                    isLoading : !!isLoading , loadingError, 
                    loadedValues : this.state.loadedValues || loadedValues
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

    renderPostLoading = (loadedValues) => {
        return(
            this.renderChildren({loadedValues})
        );
    }
}
//TODO: Document all proptypes
Entities.propTypes = {
    sync : PropTypes.bool
};

export default Entities;