import * as React from "react";
import { valueFormatter } from "powerbi-visuals-utils-formattingutils";
import { columnHidden, columnModel, DataMeasure, State, TableDataPoint } from './models';
import Checkbox from './checkbox';
import GroupViewModel from "./groupViewModel";

export const initialState: State = {
    tableModel: {
        dataPointsOriginal: [],
        dataPoints: [],
        columns: []
    }
}

export class ReactTable extends React.Component<{ state: State }>{
    state: State = initialState;
    private static updateCallback: (data: object) => void = null;

    constructor(props: any) {
        super(props);
        this.state = initialState;
    }

    public static update(newState: State) {
        if (typeof ReactTable.updateCallback === 'function') {
            ReactTable.updateCallback(newState);
        }
    }

    public componentWillMount() {
        ReactTable.updateCallback = (newState: State): void => { this.setState(newState); };
    }

    public componentWillUnmount() {
        ReactTable.updateCallback = null;
    }

    render() {
        const divStyle: React.CSSProperties = { width: '100%', padding: '5px' };
        return (
            <div className="table-responsive">
                <div className="prop-list">
                    <ul>
                        {this.renderCheckboxes()}
                    </ul>
                </div>
                <table className="table table-sm table-bordered table-hover table-striped">
                    <thead className="table-dark">
                        <tr>
                            {this.renderTableHeader()}
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTableBody()}
                    </tbody>
                    <tfoot>
                        {this.renderTableFoot()}
                    </tfoot>
                </table>
            </div>
        )
    }

    toggleCheckbox = (index) => {
        let col = this.state.tableModel.columns.find(col => col.index == index);
        if (col) {
            col.isHidden = !col.isHidden;
        }
        let columnsHidden: columnHidden[] = this.state.tableModel.columns.map(col => {
            return {
                index: col.index,
                displayName: col.displayName,
                isHidden: col.isHidden
            }
        });

        this.state.tableModel.dataPoints = GroupViewModel(this.state.tableModel);

        this.state.storage.set("columnsHidden", JSON.stringify(columnsHidden));
        this.setState(this.state);
    }

    renderCheckboxes() {
        return this.state.tableModel.columns
            .map(col => {
                return (
                    <li>
                        <Checkbox
                            label={col.displayName}
                            index={col.index}
                            isHidden={col.isHidden}
                            classN={col.isMeasure?'measure':'dimension'}
                            handleCheckboxChange={this.toggleCheckbox}
                            key={"chk_" + col.index}
                        />
                    </li>
                )
            });
    }

    renderTableHeader() {
        return this.state.tableModel.columns
            .filter(col => !col.isHidden)
            .map((col, idx) => {
                const textAlign: React.CSSProperties = { textAlign: col.isMeasure ? 'right' : 'left' };
                return (
                    <th style={textAlign}>{col.displayName}</th>
                )
            });
    }

    renderTableBody() {
        return this.state.tableModel.dataPoints.map((row, idx) => {
            const catRow = this.renderCategories(row);
            const valRow = this.renderMeasures(row);
            const exist = row.measures
                .filter(mea => {
                    let col = this.state.tableModel.columns.find(col => col.index == mea.index);
                    if (col && !col.isHidden) {
                        return true;
                    } else {
                        return false;
                    }
                }).filter(mea => mea.value != null).length;
            const displayStyle: React.CSSProperties = { display: exist > 0 ? 'table-row' : 'none' };
            return (
                <tr key={idx} style={displayStyle}>
                    {catRow}
                    {valRow}
                </tr>
            )
        });
    }
    renderCategories(row: TableDataPoint) {
        return row.categories
            .filter(cat => {
                let col = this.state.tableModel.columns.find(col => col.index == cat.index);
                if (col && !col.isHidden) {
                    return true;
                } else {
                    return false;
                }
            })
            .map(category => {
                return (
                    <td>{category.value}</td>
                )
            });
    }
    renderMeasures(row: TableDataPoint) {
        return row.measures
            .filter(mea => {
                let col = this.state.tableModel.columns.find(col => col.index == mea.index);
                if (col && !col.isHidden) {
                    return true;
                } else {
                    return false;
                }
            })
            .map(measure => {
                const textAlign: React.CSSProperties = { textAlign: 'right' };
                let value: number;
                if (measure.value) {
                    value = parseFloat(measure.value.toString().replace(/[^\-0-9.]/g, '')) as number;
                }
                const pbFormat: string = measure.format || "#,##0;(#,##0)"
                let iValueFormatter = valueFormatter.create({ cultureSelector: "en-US", format: pbFormat });
                let valueFormatted = iValueFormatter.format(value);
                return (
                    <td style={textAlign}>{valueFormatted}</td>
                );
            });
    }

    renderTableFoot() {
        const countCats = this.state.tableModel.columns.filter(col => !col.isMeasure && !col.isHidden).length;

        let valueTotals: DataMeasure[] = this.state.tableModel.columns
            .filter(col => col.isMeasure && !col.isHidden)
            .map(mea => {
                return {
                    index: mea.index,
                    value: 0
                };
            });

        valueTotals.forEach(valT => {
            valT.value =
                this.state.tableModel.dataPoints.reduce((total, item) => {
                    let val = item.measures.find(mea => mea.index == valT.index);
                    if (val && val.value) {
                        total += (val.value as number);
                    }
                    return total;
                }, 0);
        });
        const totals = valueTotals.map(valT => {
            const textStyle: React.CSSProperties = { textAlign: 'right', fontWeight: 'bold' };
            let iValueFormatter = valueFormatter.create({ cultureSelector: "en-US", format: "#,##0;(#,##0)" });
            let valueFormatted = iValueFormatter.format(valT.value);
            return (
                <td style={textStyle}>
                    {valueFormatted}
                </td>
            )
        });
        const textBold: React.CSSProperties = { fontWeight: 'bold' };
        return (
            <tr>
                <td colSpan={countCats} style={textBold}>
                    Totales
                </td>
                {totals}
            </tr>
        );
    }
}

export default ReactTable;