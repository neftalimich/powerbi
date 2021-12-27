import * as React from "react";

import { State } from './models';
import PivotTable from './pivottable';

export const initialState: State = {
    pivotableModel: {
        data: [],
        rows: [],
        cols: [],
        vals: [],
        hiddenAttributes: [],
        aggregatorName: "Sum",
        rendererName: "Table"
    }
}

export class ReactPivotTable extends React.Component<{ state: State }>{
    state: State = initialState;
    private static updateCallback: (data: object) => void = null;

    constructor(props: any) {
        super(props);
        this.state = initialState;
    }

    public static update(newState: State) {
        if (typeof ReactPivotTable.updateCallback === 'function') {
            ReactPivotTable.updateCallback(newState);
        }
    }

    public componentWillMount() {
        ReactPivotTable.updateCallback = (newState: State): void => { this.setState(newState); };
    }

    public componentWillUnmount() {
        ReactPivotTable.updateCallback = null;
    }

    render() {
        const pivotTableModel = JSON.parse( JSON.stringify(this.state.pivotableModel));
        return (
            <div className="table-responsive">
                <PivotTable
                    pivottableModel={pivotTableModel}
                    handleOnChangeEvent={this.pivotChangeEvent}>
                </PivotTable>
            </div>
        )
    }

    pivotChangeEvent = (rows: string[]) => {
        this.state.pivotableModel.rows = rows;
        this.setState(this.state);
    }
}

export default ReactPivotTable;