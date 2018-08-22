import * as React from 'react';
import './app-graph-canvas.css';


class AppGraphCanvas extends React.Component {
    public render() {
        return (
            <svg className="graph-canvas-container">
                <line x1="0" y1="0" x2="200" y2="200" className="line" />
            </svg>
        );
    }
}

export default AppGraphCanvas;