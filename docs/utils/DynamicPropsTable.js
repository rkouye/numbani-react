import React, { Component } from 'react';
import PropTypes from 'prop-types';
import parsePropTypes from 'parse-prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';

class DynamicPropsTable extends Component {

    static propTypes = {
        of :  PropTypes.func.isRequired,
        comments : PropTypes.object
    }
    render() {
        const props = parsePropTypes(this.props.of);
        return (
            <table className="table table-hover">
                <thead>
                    <tr className="table-primary">
                        <th>Props</th>
                        <th>Type</th>
                        <th>Required</th>
                        <th>Comment</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(props).map( (name) => {
                        let prop = props[name];
                        return (
                            <tr key={name}>
                                <td className="table-primary"><b>{name}</b></td>
                                <td>{prop.type.name} {prop.type.value && prop.type.value.map( v => ' '+v.name)}</td>
                                <td>{prop.required.toString()}</td>
                                <td>{this.props.comments && this.props.comments[name]}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        );
    }
}

export default DynamicPropsTable;