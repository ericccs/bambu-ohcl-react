import * as React from 'react';
import './app-symbol-list.css';
import { IAppSymbolListProps } from '../app-types';
import EventEmitter = NodeJS.EventEmitter;

class AppSymbolList extends React.Component<IAppSymbolListProps> {

    public render() {
        const sidebarList : any = this.props.symbols.map(symbol => {
                const classStyle = "list-group-item " + (this.props.selectedSymbol === symbol ? "active" : "") ;
                return (<li key={symbol} className={classStyle} onClick={this.props.onSymbolChanged} data-s={symbol}>{symbol}</li>);
            });
        return (
            <ul className="list-group">
                {sidebarList}
            </ul>
        );
    }



}

export default AppSymbolList;