import * as React from "react";

import PivotTableUI from 'react-pivottable/PivotTableUI';
import TableRenderers from 'react-pivottable/TableRenderers';
import 'react-pivottable/pivottable.css';

import { PivotTableViewModel } from "./models";


import { SumM, SortAs } from "./utilities";

export const initalPivotTable: PivotTableViewModel = {
    data: [],
    rows: [],
    cols: [],
    vals: [],
    hiddenAttributes: [],
    aggregatorName: "Sum",
    rendererName: "Table"
}

export class PivotTable extends React.Component<{ pivottableModel: PivotTableViewModel, handleOnChangeEvent }> {
    constructor(props) {
        super(props);
        this.state.pivotTableModel = props.pivottableModel;
    }
    public state = {
        pivotTableModel: initalPivotTable
    }

    public handleEvent(s) {
        const { handleOnChangeEvent } = this.props;
        this.setState(s);
        handleOnChangeEvent(s.rows);
    }

    render() {
        const style: React.CSSProperties = {
            display: "block",
            width: "100%",
            height: "100%",
            overflowX: "auto"
        };
        const { pivottableModel } = this.props;
        return (
            <div style={style}>
                <PivotTableUI
                    data={pivottableModel.data}
                    rows={pivottableModel.rows}
                    cols={pivottableModel.cols}
                    vals={pivottableModel.vals}
                    aggregators={
                        { "Sum": SumM }
                    }
                    aggregatorName={pivottableModel.aggregatorName}
                    rendererName={pivottableModel.rendererName}
                    renderers={Object.assign({}, TableRenderers)}
                    sorters={
                        {
                            "Name": SortAs([
                                "%N/S PY",
                                "PY",
                                "%N/S Actual",
                                "Actual",
                                "%N/S AOP",
                                "AOP",
                                "Cajas",
                                "Ventas",
                                "Acumulado Cajas",
                                "Acumulado Ventas",
                                "AOP Cajas",
                                "AOP Monto",
                                "SOP Cajas",
                                "SOP Monto",
                                "Alc. AOP",
                                "Alc. SOP",
                                "% Participacion Venta",
                                "Prom. Diaro",
                                "Cajas PY",
                                "Ventas PY",
                                "Extemporaneos Monto",
                                "SOP Promociones"
                            ]),
                            "MetricasDinam": SortAs([
                                "Dias de Ventas",
                                "Ventas",
                                "Cajas",
                                "AOP Monto",
                                "AOP Cajas",
                                "SOP Monto",
                                "SOP Cajas",
                                "SOP Promociones",
                                "Alc AOP",
                                "Alc SOP",
                                "EXT Cajas Modificadas",
                                "EXT Cajas Proyectadas",
                                "EXT Cajas Totales",
                                "Extemp Monto",
                                "Kilos",
                                "Kilos SOP",
                                "Kilos AOP"
                            ]),
                            "MetricasExt": SortAs([
                                "EXT Cajas Totales",
                                "EXT Cajas Modificadas",
                                "EXT Cajas Proyectadas"
                            ]),
                            "Metricas Trade": SortAs([
                                "Ventas",
                                "Cajas",
                                "Disbursements",
                                "Other Expense",
                                "SuperMkt Rebate",
                                "Trade Promotion",
                                "Commercial Discount",
                                "Marketing Discount",
                                "Other Trade",
                                "Non-Billed Cases",
                            ]),
                        }
                    }
                    hiddenAttributes={pivottableModel.hiddenAttributes}
                    onChange={s => this.handleEvent(s)}
                    {...this.state}
                />
            </div>
        );
    }
}
export default PivotTable;