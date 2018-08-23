import * as React from 'react';

export interface IAppStateType {
    symbols: string[];
    selectedSymbol?: string;
    timeSeriesData?: ITimeSeriesData;
}

export interface IAppSymbolListProps {
    symbols: string[];
    selectedSymbol: string;
    onSymbolChanged: (event: React.SyntheticEvent<HTMLElement>) => void;
}

export interface IAppOhlcChartState {
    xAxis?: string[];
    yAxis?: string[];
}

export interface IAppOhlcChartProps {
    timeSeriesData: ITimeSeriesData;
}

export interface ITimeSeriesPayload {
    "Meta Data": IMetadataPayload;
    "Time Series (Daily)": ITimeSeriesPayloadGroup;
}

export interface IMetadataPayload {
    "1. Information": string;
    "2. Symbol": string;
    "3. Last Refreshed": string;
    "4. Output Size": string;
    "5. Time Zone": string;
}

export interface ITimeSeriesPayloadGroup {
    [key: string]: ITimeSeriesPayloadItem;
}

export interface ITimeSeriesPayloadItem {
    "1. open": number;
    "2. high": number;
    "3. low": number;
    "4. close": number;
    "5. volume": number;
}

export interface ITimeSeriesData {
    metaData: IMetadata;
    timeSeriesList: IPriceItem[];
}

export interface IMetadata {
    information: string;
    symbol: string;
    lastRefreshed: string;
    outputSize: string;
    timeZone: string;
}

export interface IPriceItem {
    timeKey: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface IPriceXYScale {
    originX: number;
    originY: number;
    scaleX: number;
    scaleY: number;
}

export interface IPoint {
    x: number;
    y: number;
}
