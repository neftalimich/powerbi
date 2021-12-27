"use strict";

import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IViewport = powerbi.IViewport;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
import ILocalVisualStorageService = powerbi.extensibility.ILocalVisualStorageService;
import { VisualSettings } from "./settings";


// Import React dependencies and the added component
import * as React from "react";
import * as ReactDOM from "react-dom";

import { ReactTable, initialState } from "./component";
import { State, TableViewModel, columnHidden } from "./models";
import VisualTransform from "./visualTransform";
import GroupViewModel from "./groupViewModel";

export class Visual implements IVisual {
    private target: HTMLElement;
    private reactRoot: React.ComponentElement<any, any>;
    private viewport: IViewport;
    private settings: VisualSettings;
    // ------------------------------------------ Local Storage
    private storage: ILocalVisualStorageService;
    private columnsHidden: columnHidden[];
    // ------------------------------------------ 

    constructor(options: VisualConstructorOptions) {
        //console.log('Visual constructor', options);
        this.reactRoot = React.createElement(ReactTable, {});
        this.target = options.element;

        // ------------------------------------------ Local Storage
        this.storage = options.host.storageService;
        this.columnsHidden = [];
        // ------------------------------------------

        ReactDOM.render(this.reactRoot, this.target);
    }

    public update(options: VisualUpdateOptions) {
        //console.log('Visual update', options);
        if (options.dataViews && options.dataViews[0]) {
            this.storage.get("columnsHidden").then(columnsHidden => {
                this.columnsHidden = JSON.parse(columnsHidden);
            }).catch(() => {
                this.columnsHidden = [];
                this.storage.set("columnsHidden", JSON.stringify(this.columnsHidden));
            }).finally(() => {
                const dataView: DataView = options.dataViews[0];
                this.settings = VisualSettings.parse(dataView) as VisualSettings;

                let tableModel: TableViewModel = VisualTransform(options, []);

                tableModel.dataPoints = GroupViewModel(tableModel);
                let state: State = {
                    tableModel: tableModel,
                    storage: this.storage
                };

                ReactTable.update(state);
            });

        } else {
            this.clear();
        }
    }

    private clear() {
        ReactTable.update(initialState);
    }

    /**
     * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
     * objects and properties you want to expose to the users in the property pane.
     *
     */
    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
        return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
    }
}