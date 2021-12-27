"use strict";

import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;

import { TableViewModel, TableDataPoint, columnModel, DataCategory, DataMeasure, columnHidden } from "./models";

function VisualTransform(options: VisualUpdateOptions, columnsHidden: columnHidden[]): TableViewModel {
    let dataViews = options.dataViews;
    console.log("dataViews", dataViews);

    let viewModel: TableViewModel = {
        dataPoints: [],
        dataPointsOriginal: [],
        columns: []
    };

    let cols: columnModel[] = [];
    const columns0 = dataViews[0].table.columns;
    for (let i = 0; i < columns0.length; i++) {
        const col = columns0[i];
        cols.push({
            displayName: col.displayName,
            index: col.index || 0,
            isMeasure: col.isMeasure || false,
            isHidden: true
        });
        if (col.isMeasure) {
            i++;
        }
    }

    viewModel.columns = cols.sort((a, b) => {
        let index1 = a.index;
        let index2 = b.index;
        if (a.isMeasure) {
            index1 += 100;
        }
        if (b.isMeasure) {
            index2 += 100;
        }
        if (index1 < index2) {
            return -1;
        }
        if (index1 > index2) {
            return 1;
        }
        return 0;
    });


    dataViews.forEach(dataView => {
        const table = dataView.table;
        const columns = table.columns;

        table.rows.forEach(row => {
            try {
                let cats: DataCategory[] = [];
                let vals: DataMeasure[] = [];
                for (let i = 0; i < columns.length; i++) {
                    const col = columns[i];

                    if (col.isMeasure) {
                        vals.push({
                            index: col.index || 0,
                            value: row[i],
                            format: row[i + 1] as string
                        });
                        i++;
                    } else {
                        cats.push({
                            index: col.index || 0,
                            value: row[i] as string,
                            isHidden: true
                        });
                    }
                }
                viewModel.dataPointsOriginal.push({
                    categories: cats,
                    measures: vals,
                    dataKey: ''
                });
            } catch (err) {
                console.log("ERROR", err);
            }
        });
    });

    console.log("viewModel", viewModel);

    return viewModel;
}

export default VisualTransform;