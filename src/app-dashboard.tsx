import * as React from 'react';
import './app-dashboard.css';
import AppGraphCanvas from './app-graph-canvas';
import { IAppStateType } from './app-types';
import AppSymbolList from './app-symbol-list';

class AppDashboard extends React.Component<{}, IAppStateType> {
    constructor(props: any) {
        super(props);
        this.state = {
            symbols: ["MSFT", "AAPL", "INTC", "NFLX", "ORCL", "CMCSA", "GOOG", "LUV", "HOG", "GOOGL", "AMZN"],
            timeSeriesPayload: {}
        }
    }

    public render() {
        return (
            <div className="card-container">
                <div className="card-header">
                    Dashboard
                </div>
                <div className="card-body">
                    <div className="card-sidebar">
                        <AppSymbolList symbols={this.state.symbols} />
                    </div>
                    <div className="card-content">
                        <AppGraphCanvas />
                    </div>
                </div>
                <div className="card-footer">
                    Status: online
                </div>
            </div>
        );
    }


    public componentDidMount() {
        fetch("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=demo")
            .then(resp => {
                return resp.json();
            })
            .then(payload => {
                console.log(JSON.stringify(payload));
            });
    }
}

export default AppDashboard;