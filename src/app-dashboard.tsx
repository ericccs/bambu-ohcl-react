import * as React from 'react';
import './app-dashboard.css';
import AppGraphCanvas from './app-graph-canvas';
import AppSymbolList from './app-symbol-list';

class AppDashboard extends React.Component {
    public render() {
        return (
            <div className="card-container">
                <div className="card-header">
                    Dashboard
                </div>
                <div className="card-body">
                    <div className="card-sidebar">
                        <AppSymbolList />
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
}

export default AppDashboard;