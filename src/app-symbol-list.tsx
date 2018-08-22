import * as React from 'react';
import './app-symbol-list.css';

class AppSymbolList extends React.Component {

    public render() {
        const ccyList: string[] = ["USD", "SGD", "GBP"];
        const sidebarList : any[] = ccyList.map(ccy => <li className="list-group-item" key="{ccy}">{ccy}</li>);
        return (
            <ul className="list-group">
                {sidebarList}
            </ul>
        );
    }

}

export default AppSymbolList;