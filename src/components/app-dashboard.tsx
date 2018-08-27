import * as React from 'react';
import './app-dashboard.css';
import AppOhlcChart from './chart/ohlc-chart';
import AppSymbolList from './app-symbol-list';
import {IAppStateType, ITimeSeriesPayload, ITimeSeriesData, IMetadata, IPriceItem} from '../app-types';
import {ALPHA_VANTAGE_PARAM_FUNCTION, ALPHA_VANTAGE_URL} from '../app-config';

class AppDashboard extends React.Component<{}, IAppStateType> {
    constructor(props: any) {
        super(props);
        this.state = {
            symbols: ["MSFT", "AAPL", "INTC", "NFLX", "ORCL", "CMCSA", "GOOG", "LUV", "HOG", "GOOGL", "AMZN"],
            selectedSymbol: undefined,
            timeSeriesData: undefined,
            statusMessage: "Dashboard"
        }
    }

    public render() {
        const ohclChart = !!this.state.timeSeriesData ? (<AppOhlcChart timeSeriesData={ this.state.timeSeriesData } />) : "";
        return (
            <div className="card-container">
                <div className="card-header">
                    {this.state.statusMessage}
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
        console.log("cookies: ", document.cookie);
        let symbol: string = "";
        if(!this.state.selectedSymbol) {
            const symbols: string[] = document.cookie.split(";")
                .filter(cookie => cookie.indexOf("symbol=") >= 0)
                .map(cookie => cookie.replace("symbol=", ""));
            symbol = symbols ? symbols[0] : "";
            console.log("load symbol from cookies: ", symbol);
        }
        symbol = !!symbol ? symbol : this.state.symbols[0];
        this.updatePayload(symbol);
        this.setState({selectedSymbol: symbol});
    }

    public handleSymbolChanged = (event: React.MouseEvent<HTMLLIElement>): void => {
        const targetData: string = event.currentTarget.innerText;
        console.log("handleSymbolChanged: ", targetData);
        this.setState({selectedSymbol: targetData});
        this.updatePayload(targetData);
        document.cookie = `symbol=${targetData};`;
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
            })
            .catch(error => {
                console.log("error: ", error);
                this.setState({ statusMessage: "error: " + error });
            });
    }

}

export default AppDashboard;