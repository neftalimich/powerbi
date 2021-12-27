"use strict";

import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
import VisualDataChangeOperationKind = powerbi.VisualDataChangeOperationKind;

import { VisualSettings } from "./settings";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { ReactPivotTable, initialState } from "./component";
import { State, PivotTableViewModel } from "./models";
import VisualTransform from "./visualTransform";


export class Visual implements IVisual {
    private target: HTMLElement;
    private reactRoot: React.ComponentElement<any, any>;
    private settings: VisualSettings;
    private visualHost: IVisualHost;
    private auxDataViews: DataView[];

    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
        this.reactRoot = React.createElement(ReactPivotTable, {});
        this.target = options.element;
        this.visualHost = options.host;
        this.auxDataViews = [];

        ReactDOM.render(this.reactRoot, this.target);
    }

    public update(options: VisualUpdateOptions) {
        console.log('Visual update', options);

        if (options.dataViews && options.dataViews[0]) {
            const dataView: DataView = options.dataViews[0];
            this.settings = VisualSettings.parse(dataView) as VisualSettings;

            let pivotTableModel: PivotTableViewModel;

            let process: boolean = true;

            if (options.operationKind == VisualDataChangeOperationKind.Create) {
                //console.log("first");
                this.auxDataViews = [];
            }

            if (options.operationKind == VisualDataChangeOperationKind.Segment) {
                //console.log("second");
            }

            if (dataView.metadata.segment) {
                let request_accepted: boolean = this.visualHost.fetchMoreData(false);
                if (!request_accepted) {
                    console.log("error");
                } else {
                    console.log("esperar nuevo");
                }
            }

            this.auxDataViews.push(dataView);

            if (process) {
                pivotTableModel = VisualTransform(this.auxDataViews);
                let state: State = { pivotableModel: pivotTableModel };
                ReactPivotTable.update(state);
            }
        } else {
            this.clear();
        }
    }

    private clear() {
        ReactPivotTable.update(initialState);
    }

    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
        return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
    }
}