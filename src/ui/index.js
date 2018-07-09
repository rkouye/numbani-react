import React, { Component } from 'react';
import PropsTypes from 'prop-types';
import Async from 'react-promise';
/**
 * 
 * @param {import("../model/core/EntityRepo.js").default} repo 
 * @param {Object} uiLib
 */

//TODO: Allow component to display information about the context they provide and the one they consume

function makeEntityView(repo, uiLib) {

    const InlineLoadingIndicatior = uiLib.InlineLoadingIndicatior;
    const ActionButton = uiLib.ActionButton;
    const AlertError = uiLib.AlertError;

    const EntityView = {};
    const EntityViewValueContext = React.createContext();

    EntityView.one = class EntityViewOne extends Component {

        static propTypes = {
            value: PropsTypes.object.isRequired,
            layout: PropsTypes.func,
            onChange: PropsTypes.func
        }

        constructor(props) {
            super(props);
            this.state = {
                edited: {}
            };
        }

        getAttributeUpdater = (attribute) => {
            return attributeValue => {
                this.setState((prevState, props) => ({
                    // Update internal knowledge of field being edited or not
                    edited: { ...prevState.edited, [attribute]: true }

                }), () => {
                    // Propagate value update
                    if (this.props.onChange) this.props.onChange({
                        ...this.props.value, [attribute]: attributeValue
                    });
                });
            };
        }

        render() {
            return (
                <EntityViewValueContext.Provider value={{
                    edit: this.props.edit,
                    value: this.props.value,
                    getAttributeUpdater: this.getAttributeUpdater
                }}>
                    {this.props.layout ? this.props.layout(EntityView) : this.props.children}
                </EntityViewValueContext.Provider>
            );
        }
    }
    EntityView.fields = {};
    for (let attribute in repo.schema.typesMap) {
        const TypeControl = uiLib.getControlForType(repo.schema.typesMap[attribute]);
        EntityView.fields[attribute] = class AttributeView extends Component {
            render() {
                return (
                    <EntityViewValueContext.Consumer>
                        {({ edit, value, getAttributeUpdater }) =>
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

    EntityView.read = class EntityViewRead extends Component {
        static propTypes = {
            entityRef: PropsTypes.object.isRequired,
            sync: PropsTypes.bool, //TODO: Implement sync
            children: PropsTypes.func.isRequired,
            renderError: PropsTypes.func,
            renderLoading: PropsTypes.element
        }
        constructor(props) {
            super(props);
            this.state = {};
        }

        static getDerivedStateFromProps(props, state) {
            return (state.entityRef === props.entityRef) ? {} : {
                entityRef: props.entityRef,
                promise: repo.read(props.entityRef)
            }
        }

        render() {
            return (
                <Async
                    promise={this.state.promise}
                    then={this.props.children}
                    catch={this.props.renderError || (error => <AlertError error={error} localize />)}
                    pending={this.props.renderLoading || <InlineLoadingIndicatior />} //TODO: Maybe bloc loading indicator ?
                />
            );
        }
    }

    const SingleEntityConnectContext = React.createContext();

    EntityView.connect = class EntityViewConnect extends Component {

        //TODO: Implement cascading props with read, one...
        static propTypes = {
            entityRef: PropsTypes.object.isRequired,
            sync: PropsTypes.bool, //TODO: Implement sync
            edit: PropsTypes.bool,
            renderError: PropsTypes.func,
            renderLoading: PropsTypes.element,
            layout: PropsTypes.func
        }

        static getInitialState(entityRef) {
            return {
                entityRef,
                shared: {}
            }
        }

        static getDerivedStateFromProps(props, state) {
            if (props.entityRef !== state.entityRef) {
                if(state.editedValue) console.warn("Resetting state on an entity view with pending modification. Make sure this is really what you want to do.");
                return EntityViewConnect.getInitialState(props.entityRef);
            } else return null;
        }

        constructor(props) {
            super(props);
            this.state = EntityViewConnect.getInitialState(props.entityRef);
        }

        onChange = (value) => {
            //TODO: Document state available in context
            this.setState((prevState) => ({
                shared: {
                    ...prevState.shared,
                    editedValue: value,
                    validationErrorsPromise: repo.validate(value),
                }
            }));
        }

        save = () => {
            if (!this.state.shared.editedValue) {
                console.warn("You tried to save although no edit have been made to the value.")
            } else {
                this.setState((prevState) => ({
                    shared: {
                        ...prevState.shared,
                        savingPromise: repo.save(prevState.shared.editedValue, prevState.entityRef)
                    }
                }));
            }
        }

        reset = () => {
            //TODO: So this means any pending action will be forget...
            this.setState(EntityViewConnect.getInitialState(this.props.entityRef));
        }

        render() {
            return (
                <EntityView.read entityRef={this.props.entityRef} sync={this.props.sync}
                    renderError={this.props.renderError} renderLoading={this.props.renderLoading}>
                    {
                        fetched => (
                            <SingleEntityConnectContext.Provider value={{
                                save: this.save,
                                reset: this.reset,
                                state: { ...this.state.shared }
                            }}>
                                <EntityView.one value={this.state.shared.editedValue || fetched}
                                    layout={this.props.layout}
                                    onChange={this.onChange}
                                    edit={this.props.edit}>
                                    {this.props.children}
                                </EntityView.one>
                            </SingleEntityConnectContext.Provider>
                        )
                    }
                </EntityView.read>
            );
        }
    }

    EntityView.buttons = {};

    EntityView.buttons.save = class EntityViewButtonSave extends Component {

        static propTypes = {
            renderError : PropsTypes.func,
        }

        getButtonDisabled = () => {
            //TODO: Add a param to tell why the Button is disabled
            return <ActionButton disabled>{this.props.children}</ActionButton>
        }
        getButtonReady = (connectContext) => {
            return <ActionButton onClick={connectContext.save}>{this.props.children}</ActionButton>
        }
        getButtonBusyDisabled = () => {
            //TODO: Add a param to tell why the Button is busy
            return <ActionButton busy disabled>{this.props.children}</ActionButton>
        }
        getButtonWithValidation = (connectContext) => <Async
            promise={connectContext.state.validationErrorsPromise}
            before={this.getButtonDisabled}
            pending={this.getButtonDisabled}
            then={
                validationErrors => {
                    let validationErrorsCount = 0;
                    for (let attribute in validationErrors) {
                        validationErrorsCount += validationErrors[attribute].length;
                    }
                    if (validationErrorsCount > 0) {
                        //TODO: Maybe display info on why it is disabled
                        return this.getButtonDisabled();
                    } else {
                        //TODO: Maybe allow to customize this behavior
                        if (connectContext.state.editedValue) {
                            return this.getButtonReady(connectContext);
                        } else return this.getButtonDisabled();
                    }
                }
            }
        />

        getButtonSaveSuccess = (connectContext) => {
            return this.getButtonReady(connectContext)
        }
        
        getButtonWithSavingError = (connectContext, error) => <React.Fragment>
            {this.getButtonReady(connectContext)}
            { (this.props.renderError && this.props.renderError(error)) ||
                <AlertError error={error} localize />
            }
        </React.Fragment>

        render() {

            return (
                <SingleEntityConnectContext.Consumer>
                    {
                        connectContext =>
                            connectContext.state.editedValue ?
                                <Async
                                    promise={connectContext.state.savingPromise}
                                    before={() => this.getButtonWithValidation(connectContext)}
                                    pending={() => this.getButtonBusyDisabled(connectContext)}
                                    then={() => this.getButtonSaveSuccess(connectContext)}
                                    catch={(error) => this.getButtonWithSavingError(connectContext, error)}
                                />
                                :
                                this.getButtonDisabled()

                    }
                </SingleEntityConnectContext.Consumer>
            );
        }
    }

    return EntityView;
}

const UI = function (uiLib) {
    //TODO: uiLib interface should have
    /*
        - getControlForType
        - ActionButton (disabled, busy, onClick, children is content)
        - InlineLoadingIndicatior
        - AlertError (error {type error) , localize boolean)
     */
    return {
        forRepo(repo) {
            return makeEntityView(repo, uiLib);
        }
    }
};

export default UI;