import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table as BTable } from 'reactstrap';
import Entity, { injectEntityContext } from '../model/Entity';
import Attribute from './Attribute';

class TableBase extends Component {
     render() {
        const {entityContext : ec, columns, index, ...others} = this.props;
            return (
                ec.loadedValues?<BTable {...others} >
                    <thead><tr>
                        {
                            columns.map((column,i) =><th key={i}>{column.title}</th>)
                        }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            ec.loadedValues.map((value,i) =>
                                <tr key={index?value[index]:i}>
                                    <Entity repo={ec.repo} defaultValue={value}>
                                        {columns.map((column,i) =><td key={i}><Attribute name={column.name}/></td>)}
                                    </Entity>
                                </tr>
                            )
                        }
                    </tbody>
                </BTable>
                :
                null
            );
    }
}

const Table = injectEntityContext(TableBase);

Table.propTypes = {
    children : PropTypes.node,
    columns : PropTypes.arrayOf(PropTypes.shape({
        name : PropTypes.string.isRequired,
        title : PropTypes.string
    })).isRequired,
    index : PropTypes.string,
    // To be passed below
    size: PropTypes.string,
    bordered: PropTypes.bool,
    borderless: PropTypes.bool,
    striped: PropTypes.bool,
    dark: PropTypes.bool,
    hover: PropTypes.bool,
    responsive: PropTypes.bool
};

export default Table;