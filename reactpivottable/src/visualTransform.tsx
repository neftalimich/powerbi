"use strict";

import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import DataView = powerbi.DataView;

import { PivotTableViewModel } from "./models";

function VisualTransform(dataViews: DataView[]): PivotTableViewModel {
    console.log("dataViews", dataViews);
    let viewModel: PivotTableViewModel = {
        data: [],
        rows: [],
        cols: [],
        vals: [],
        hiddenAttributes: [],
        aggregatorName: "Sum",
        rendererName: "Table",
    };

    const dimensions = dataViews[0].table.columns.filter(col => !col.isMeasure);

    //viewModel.rows = [dimensions[0].displayName];
    //viewModel.cols = [dimensions[dimensions.length - 1].displayName];
    viewModel.vals = [...dataViews[0].table.columns.filter(col => col.isMeasure && col.roles).map(mea => mea.displayName)];
    viewModel.hiddenAttributes = ["Format", ...viewModel.vals];

    dataViews.forEach(dataView => {
        const table = dataView.table;
        const columns = table.columns;

        table.rows.forEach(row => {
            let item = {};
            columns.forEach((col, idx) => {
                if (col.roles) {
                    item[col.displayName] = row[idx];
                } else {
                    item["Format"] = row[idx];
                }
            });
            viewModel.data.push(item);
        });
    });

    console.log("viewModel", viewModel);

    return viewModel;
}

export default VisualTransform;