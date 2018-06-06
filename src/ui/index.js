import React, { Component } from 'react';
import PropsTypes from 'prop-types';
import Async from 'react-promise';
/**
 * 
 * @param {import("../model/core/EntityRepo.js").default} repo 
 * @param {Object} uiLib
 */
function makeEntityView(repo, uiLib){
    const EntityView = {};
    const EntityViewValueContext = React.createContext();
    
    EntityView.one = class EntityViewOne extends Component {

        static propTypes = {
            value : PropsTypes.object.isRequired,
            onChange : PropsTypes.func
        }

        constructor(props){
            super(props);
            this.state = {
                edited : {}
            };
        }

        getAttributeUpdater = (attribute)=> {
            return attributeValue => {
                this.setState((prevState,props)=> ({
                    // Update internal knowledge of field being edited or not
                    edited : { ...prevState.edited, [attribute] : true}
                
                }), () => {
                    // Propagate value update
                    if(this.props.onChange) this.props.onChange({
                        ...this.props.value, [attribute] : attributeValue
                    });
                });
            };
        }

        render() {
            return (
                <EntityViewValueContext.Provider value={{
                    edit : this.props.edit, 
                    value : this.props.value, 
                    getAttributeUpdater : this.getAttributeUpdater
                }}>
                    {this.props.layout?this.props.layout(EntityView):this.props.children}
                </EntityViewValueContext.Provider>
            );
        }
    }
    EntityView.fields = {};
    for(let attribute in repo.schema.typesMap){
        const TypeControl = uiLib.getControlForType(repo.schema.typesMap[attribute]);
        EntityView.fields[attribute] = class AttributeView extends Component {
            render() {
                return (
                    <EntityViewValueContext.Consumer>
                        {({edit, value, getAttributeUpdater}) => 
                            <TypeControl 
                                value={value[attribute]} 
                                edit={this.props.edit || edit} 
                                onChange={getAttributeUpdater(attribute)}
                            />
                        }
                    </EntityViewValueContext.Consumer>
                );
            }
        }
    }

    EntityView.read = class EntityViewQuery extends Component {
        static propTypes = {
            entityRef : PropsTypes.object.isRequired,
            sync : PropsTypes.bool,
            children : PropsTypes.func.isRequired,
            renderError : PropsTypes.func,
            renderLoading : PropsTypes.element,
        }
        constructor(props){
            super(props);
            this.state = {};
        }

        static getDerivedStateFromProps(props, state){
            return {
                promise : repo.read(props.entityRef)
            }
        }

        render(){
            return (
                <Async 
                    promise={this.state.promise}
                    then={this.props.children}
                    catch={this.props.renderError || (error => error.toString()) } // Replace by beautiful error display
                    pending={this.props.renderLoading || "Loading"}
                />
            );
        }
    }

    const EntityViewQueryContext = React.createContext();
    EntityView.connect = class EntityViewConnect extends Component {

        static propTypes = {
            entityRef : PropsTypes.object.isRequired,
            sync : PropsTypes.bool
        }
        
        render() {
            return (
                <EntityViewQueryContext.Provider value={{

                }}>
                </EntityViewQueryContext.Provider>
            );
        }
    }
    
    return EntityView;
}

const UI = function(uiLib){
    //TODO: uiLib interface should have
    /*
        - getControlForType
        - getValidationFeedbackForType
        - 
     */
    return {
        entity(repo){ 
            return makeEntityView(repo, uiLib);
        }
    }
};

export default UI;