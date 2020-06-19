import React, { Component } from "react";
import { sortBy, reverse } from "lodash";

import s from "./styles.module.css";

const ASC = "asc";
const DSC = "dsc";
const defaultSort = DSC;

export default class Table extends Component {
  constructor(props) {
    super();

    this.state = {
      sortField: props.defaultSortField,
      sortDirection: defaultSort,
    };
  }

  onHeaderClick = (ev, cell) => {
    const { sortField, sortDirection } = this.state;

    if (sortField === cell.name) {
      this.setState({
        sortDirection: sortDirection === ASC ? DSC : ASC,
      });
    } else {
      this.setState({
        sortField: cell.name,
        sortDirection: defaultSort,
      });
    }
  };

  sortData = () => {
    const { sortField, sortDirection } = this.state;
    const { data, columns } = this.props;

    if (!sortField) {
      return data;
    }

    const colToSortBy =
      columns.find((col) => col.name === sortField) || columns[0];
    const sortValueFn = colToSortBy.sortValue || colToSortBy.cell;

    const sorted = sortBy(data, (item) => {
      return sortValueFn(item);
    });

    return sortDirection === ASC ? sorted : reverse(sorted);
  };

  render() {
    const { columns } = this.props;
    const rows = this.sortData();

    return (
      <table className={s.table}>
        <thead>
          <tr>
            {columns.map((c, index) => (
              <td key={c.name} onClick={(ev) => this.onHeaderClick(ev, c)}>
                {c.name}
              </td>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((rowData) => {
            return (
              <tr>
                {columns.map((c) => (
                  <td key={c.name}>{c.cell(rowData)}</td>
                ))}
              </tr>
            );
          })}
        </tbody>

        <tfoot>
          <tr>
            <td>Totals:</td>
            {columns.slice(1).map((c) => {
              const count =
                c.hasTotal &&
                rows.reduce((acc, rowData) => {
                  return acc + (c.cell(rowData) || 0);
                }, 0);

              return <td key={c.name}>{c.hasTotal ? count : ""}</td>;
            })}
          </tr>
        </tfoot>
      </table>
    );
  }
}
