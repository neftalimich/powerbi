'use strict'
import powerbi from "powerbi-visuals-api";
import ILocalVisualStorageService = powerbi.extensibility.ILocalVisualStorageService;
import PrimitiveValue = powerbi.PrimitiveValue;

export interface columnHidden {
    index: number;
    displayName: string;
    isHidden: boolean;
}

export interface columnModel {
    displayName: string;
    index: number;
    isMeasure: boolean;
    isHidden: boolean;
}

export interface DataCategory {
    index: number;
    value: string;
    isHidden: boolean;
}

export interface DataMeasure {
    index: number;
    value?: PrimitiveValue;
    format?: string;
}

export interface TableDataPoint {
    categories: DataCategory[];
    measures: DataMeasure[];
    dataKey: string;
}

export interface TableViewModel {
    dataPointsOriginal: TableDataPoint[];
    dataPoints: TableDataPoint[];
    columns: columnModel[];
}

export interface State {
    tableModel: TableViewModel,
    storage?: ILocalVisualStorageService;
}

export default State;