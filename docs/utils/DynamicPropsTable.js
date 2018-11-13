import React, { Component } from 'react';
import PropTypes from 'prop-types';
import parsePropTypes from 'parse-prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';

const displayProp = ({ required, type }) => <span>{required ? <b>required</b> : " "} {displayType(type)}</span>

const displayType = ({ name, value }) => <span>
    {name ? name : ''}
    {" "}
    {name === "arrayOf" ? [<b key="[">[</b>, <React.Fragment key="prop">{displayType(value)}</React.Fragment>, <b key="]">]</b>] : ''}
    {name === "shape" ?
        [<b key="{">{'{'}</b>,
        <br key="br" />,
        ...Object.keys(value).map(key => <span key={key}>
            {key} :  {displayProp(value[key])} <br />
        </span>),
        <b key="}">{'}'}</b>
        ] : ""
    }
    {name === "oneOfType" ?<span>
        [{ value.map(type => <span key={type.name}> {displayType(type)} </span>) }]
    </span>: ""
    }
</span>;

class DynamicPropsTable extends Component {

    static propTypes = {
        of: PropTypes.func.isRequired,
        comments: PropTypes.object
    }
    render() {
        const props = parsePropTypes(this.props.of);
        return (
            <table className="table table-hover">
                <thead>
                    <tr className="table-primary">
                        <th>Props</th>
                        <th>Type</th>
                        <th>Comment</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(props).map((name) => {
                        let prop = props[name];
                        return (
                            <tr key={name}>
                                <td className="table-primary"><b>{name}</b></td>
                                <td>{console.log(prop) || displayProp(prop)}</td>
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