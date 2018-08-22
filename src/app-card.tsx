import * as React from 'react';
import './app-card.css';

class AppCard extends React.Component {
    public render() {
        return (
            <div className="card-container">
                <div className="card-header">OHCL</div>
                <div className="card-body">
                    Card Body
                </div>
                <div className="card-footer">
                    Card Footer
                </div>
            </div>
        );
    }
}

export default AppCard;