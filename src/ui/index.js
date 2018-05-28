import React, { Component } from 'react';

/**
 * 
 * @param {import("../model/core/EntityRepo.js").default} repo 
 * @param {Object} uiLib
 */
function makeComponent(repo, uiLib){
    const EntityView = {};
    const EntityViewContext = React.createContext();
    
    EntityView.one = class extends Component {
        constructor(props){
            super(props);
            this.state = {
                value : this.props.value
            };
        }

        getAttributeUpdater = (attribute)=> {
            return value => {
                this.setState({[attribute] : value});
            };
        }

        render() {
            return (
                <EntityViewContext.Provider value={{
                    edit : this.props.edit, 
                    value : this.state.value, 
                    getAttributeUpdater : this.getAttributeUpdater
                }}>
                    {this.props.layout?this.props.layout(EntityView):this.props.children}
                </EntityViewContext.Provider>
            );
        }
    }
    EntityView.fields = {};
    for(let attribute in repo.schema.typesMap){
        const TypeControl = uiLib.getControlForType(repo.schema.typesMap[attribute]);
        EntityView.fields[attribute] = class AttributeView extends Component {
            render() {
                return (
                    <EntityViewContext.Consumer>
                        {({edit, value, getAttributeUpdater}) => 
                            <TypeControl 
                                value={value[attribute]} 
                                edit={this.props.edit || edit} 
                                onChange={getAttributeUpdater(attribute)}
                            />
                        }
                    </EntityViewContext.Consumer>
                );
            }
        }
    }
    return EntityView;
}

const UI = function(uiLib){
    return {
        entity(repo){ 
            return makeComponent(repo, uiLib);
        }
    }
};

export default UI;