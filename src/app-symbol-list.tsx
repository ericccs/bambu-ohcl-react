import * as React from 'react';
import './app-symbol-list.css';
import { IAppSymbolListProps } from './app-types';

class AppSymbolList extends React.Component<IAppSymbolListProps> {
    // constructor(props: string[]) {
    //     super(props);
    // }

    public render() {
        const sidebarList : any = this.props.symbols.map((symbol) => <li className="list-group-item" key={symbol}>{symbol}</li>);
        return (
            <ul className="list-group">
                {sidebarList}
            </ul>
        );
    }

}

export default AppSymbolList;