'use strict'

import powerbi from "powerbi-visuals-api";
import ILocalVisualStorageService = powerbi.extensibility.ILocalVisualStorageService;

export interface PivotTableViewModel {
    data: any[];
    rows: string[];
    cols: string[];
    vals: string[];
    hiddenAttributes: string[];
    aggregatorName: string;
    rendererName: string;
}

export interface State {
    pivotableModel: PivotTableViewModel,
}

export default State;