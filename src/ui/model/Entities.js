import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Async from 'react-promise';
import {EntityContext} from './Entity';

class Entities extends Component {

    static getInitialState(repo, entitiesRef, defaultList) {
        return {
            entitiesRef, //Just to compare on props change
            repo, // Just to compare on props change
            defaultList, // Just to compare on props change
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.entitiesRef !== state.entitiesRef 
            || props.repo !== state.repo 
            || (!props.entitiesRef && (props.defaultList !== state.defaultList))
        )
        {
            return Entities.getInitialState(props.repo, props.entitiesRef, props.defaultList);
        } else return null;
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    _loadData(repo, entitiesRef, defaultList){
        if(this._loadingPromise){
            //TODO: Cancel here when repo request will be cancellable
            this._loadingPromise = null;
        }
        const loadingPromise = entitiesRef?
        repo.read(entitiesRef).then(values => {
            if(!values && !defaultList) throw new Error("Entity list is "+values);
            if(!Array.isArray(values || defaultList))
                throw new Error("Entity list is expected to be an array");
            return values || defaultList;
        })
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
                    this._loadingPromise = null;
                }
            }).catch(console.warn); // Just log here cause, Async will pass it to user.
        });

    }

    componentDidMount(){
        this._loadData(this.props.repo, this.props.entitiesRef, this.props.defaultList);
    }

    componentDidUpdate(){
        if(this.state.loadingPromise === null){
            this._loadData(this.props.repo, this.props.entitiesRef, this.props.defaultList);
        }
    }

    componentWillUnmount(){
        if(this._loadingPromise){
            //TODO: Cancel here when repo request will be cancellable
            this._loadingPromise = null;
        }
    }

    commands = {
        reload : ()=>{
            this.setState((prevState, props) => 
                Entities.getInitialState(props.repo, props.entitiesRef, props.defaultList)
            );
        }
    };

    renderChildren = ({isLoading, loadingError, loadedValues}) => {
        return <EntityContext.Provider value={{ 
            repo : this.props.repo, 
            entitiesRef : this.props.entitiesRef,
            defaultList : this.props.defaultList,
            // Loading
            loadedValues,
            loadingPromise : this.state.loadingPromise,
            isLoading : !!isLoading,
            loadingError,
            // Command
            ...this.commands
        }}>
        {(typeof this.props.children === 'function')?
            this.props.children(
                loadedValues,
                { 
                    isLoading : !!isLoading , loadingError, loadedValues
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

    renderPostLoading= (loadedValues)=>{
        return(
            this.renderChildren({loadedValues})
        );
    }

}

Entities.propTypes = {

};

export default Entities;