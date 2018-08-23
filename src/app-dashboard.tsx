import * as React from 'react';
import './app-dashboard.css';
import AppOhlcChart from './app-ohlc-chart';
import AppSymbolList from './app-symbol-list';
import {IAppStateType, ITimeSeriesPayload, ITimeSeriesData, IMetadata, IPriceItem} from './app-types';
import {ALPHA_VANTAGE_PARAM_FUNCTION, ALPHA_VANTAGE_URL} from './app-config';

class AppDashboard extends React.Component<{}, IAppStateType> {
    constructor(props: any) {
        super(props);
        this.state = {
            symbols: ["MSFT", "AAPL", "INTC", "NFLX", "ORCL", "CMCSA", "GOOG", "LUV", "HOG", "GOOGL", "AMZN"],
            selectedSymbol: undefined,
            timeSeriesData: undefined
        }
    }

    public render() {
        const ohclChart = !!this.state.timeSeriesData ? (<AppOhlcChart timeSeriesData={ this.state.timeSeriesData } />) : "";
        return (
            <div className="card-container">
                <div className="card-header">
                    Dashboard
                </div>
                <div className="card-body">
                    <div className="card-sidebar">
                        <AppSymbolList symbols={this.state.symbols}
                                       selectedSymbol={this.state.selectedSymbol ? this.state.selectedSymbol : this.state.symbols[0]}
                                       onSymbolChanged={this.handleSymbolChanged} />
                    </div>
                    <div className="card-content">
                        {ohclChart}
                    </div>
                </div>
                <div className="card-footer">
                    Status: online
                </div>
            </div>
        );
    }

    public componentDidMount() {
        this.updatePayload(this.state.selectedSymbol ? this.state.selectedSymbol : this.state.symbols[0]);
    }

    public handleSymbolChanged = (event: React.SyntheticEvent<HTMLElement>): void => {
        console.log("click: ", event.currentTarget.innerText);
        this.setState({selectedSymbol: event.currentTarget.innerText});
        this.updatePayload(event.currentTarget.innerText);
    }

    private updatePayload(symbol : string) : void {
        console.log("fetch symbol: ", symbol)
        fetch(ALPHA_VANTAGE_URL + ALPHA_VANTAGE_PARAM_FUNCTION(symbol))
            .then(resp => {
                return resp.json();
            })
            .then(payload => payload as ITimeSeriesPayload)
            .then(payload => {
                const metadata: IMetadata = {
                    information: payload["Meta Data"]["1. Information"],
                    symbol: payload["Meta Data"]["2. Symbol"],
                    lastRefreshed: payload["Meta Data"]["3. Last Refreshed"],
                    outputSize: payload["Meta Data"]["4. Output Size"],
                    timeZone: payload["Meta Data"]["5. Time Zone"],
                };
                const timeSeriesDailyPayload = payload["Time Series (Daily)"];
                const timeSeriesKeys: string[] = Object.keys(timeSeriesDailyPayload);
                // console.log("timeSeriesKeys: ", timeSeriesKeys);
                const timeSeriesPriceList: IPriceItem[] = timeSeriesKeys.map(key => {
                    const priceItem: IPriceItem = {
                        timeKey: key,
                        open: timeSeriesDailyPayload[key]["1. open"],
                        high: timeSeriesDailyPayload[key]["2. high"],
                        low: timeSeriesDailyPayload[key]["3. low"],
                        close: timeSeriesDailyPayload[key]["4. close"],
                        volume: timeSeriesDailyPayload[key]["5. volume"]
                    };
                    return priceItem;
                });

                const data: ITimeSeriesData = {
                    metaData: metadata,
                    timeSeriesList: timeSeriesPriceList
                };
                this.setState({ timeSeriesData: data });
            });
    }

}

export default AppDashboard;