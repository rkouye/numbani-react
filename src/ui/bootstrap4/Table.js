import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table as BTable } from 'reactstrap';
import Entity, { injectEntityContext } from '../model/Entity';
import Attribute from './Attribute';

const accessValue = (value, accessor) => typeof accessor === 'function' ? accessor(value) : value[accessor];

class BaseTable extends Component {
    render() {
        const { entityContext: ec, columns, index, placeholder, ...others } = this.props;
        return (
            ec.loadedValues ? (
                (ec.loadedValues.length > 0) ? <BTable {...others} >
                    <thead><tr>
                        {
                            columns.map((column, i) => <th key={i}>{column.header}</th>)
                        }
                    </tr>
                    </thead>
                    <tbody>
                        {
                            ec.loadedValues.map((value, i) =>
                                <tr key={index ? value[index] : i}>
                                    <Entity repo={ec.repo} defaultValue={value}>
                                        {columns.map((column, i) =>
                                            <td key={i}>
                                                {
                                                    typeof column.cell === "function" ?
                                                        column.cell(value)
                                                        :
                                                        <Attribute name={column.cell} />
                                                }
                                            </td>)
                                        }
                                    </Entity>
                                </tr>
                            )
                        }
                    </tbody>
                </BTable>
                    :
                    (placeholder || null)
            ) : null
        );
    }
}

const Table = injectEntityContext(BaseTable);

Table.propTypes = {
    children: PropTypes.node,
    columns: PropTypes.arrayOf(PropTypes.shape({
        header: PropTypes.node.isRequired,
        cell: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired
    })).isRequired,
    placeholder: PropTypes.node,
    index: PropTypes.string,
    size: PropTypes.string,
    bordered: PropTypes.bool,
    borderless: PropTypes.bool,
    striped: PropTypes.bool,
    dark: PropTypes.bool,
    hover: PropTypes.bool,
    responsive: PropTypes.bool
};

export default Table;