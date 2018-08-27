import * as React from 'react';
import './ohlc-chart.css';
import {
    IAppOhlcChartProps,
    IAppOhlcChartState,
    IPoint,
    ITimeSeriesData,
    IPriceItem,
    IPriceXYScale
} from "../../app-types";


class OhlcChart extends React.Component<IAppOhlcChartProps, IAppOhlcChartState> {

    public render() {
        const scale: IPriceXYScale = this.calculatePriceScale(this.props.timeSeriesData);
        const prices: IPriceItem[] = this.props.timeSeriesData.timeSeriesList;

        const ohlcChart = prices.map((price, idx) => OhlcSymbol(price, scale, idx));
        return (
            <svg style={chartCanvasStyle}>
                <g>
                    {ohlcChart}
                </g>

                { AxisDraw(scale) }
            </svg>
        );
    }

    public componentDidMount() {
        this.calculateTimeScale(this.props.timeSeriesData);
    }

    private calculateTimeScale(timeSeriesData: ITimeSeriesData): string[] {
        return timeSeriesData.timeSeriesList.map(item => item.timeKey);
    }

    private calculatePriceScale(timeSeriesData: ITimeSeriesData): IPriceXYScale {
        const priceSample: number[] = timeSeriesData.timeSeriesList
            .map(priceItem => {
                const priceArr: number[] = [];
                priceArr.push(priceItem.open);
                priceArr.push(priceItem.high);
                priceArr.push(priceItem.low);
                priceArr.push(priceItem.close);
                return priceArr;
            })
            .reduce((acc, priceArr) => {
                Array.prototype.push.apply(acc, priceArr);
                return acc;
            }, []);

        const minValue: number = Math.floor(Math.min(...priceSample));
        const maxValue: number = Math.floor(Math.max(...priceSample)) + 1;
        const rangeValue: number = maxValue - minValue;

        console.log("minPrice: ", minValue);
        console.log("maxPrice: ", maxValue);
        console.log("rangeValue: ", rangeValue);

        const scale: IPriceXYScale = {
            originX: 100,
            originY: (500+minValue),
            scaleX: 10,
            scaleY: (500/rangeValue),
            maxPrice: maxValue,
            minPrice: minValue,
            rangeVal: rangeValue
        };
        return scale;
    }
}

export default OhlcChart;

const chartCanvasStyle : any = {
    width: '800px',
    height: '600px'
}

const polyLineRedStyle: any = {
    fill: 'none',
    stroke: 'red',
    strokeWidth: '2px'
};

const polyLineGreenStyle: any = {
    fill: 'none',
    stroke: 'green',
    strokeWidth: '2px'
};

function OhlcSymbol(price: IPriceItem, scale: IPriceXYScale, idx: number) {
    const xyOrigin: IPoint = xy(scale.originX + (idx * scale.scaleX), scale.originY-((price.high-scale.minPrice)*scale.scaleY));
    const point: IPoint[] = [ xyOrigin,
        xy(xyOrigin.x, xyOrigin.y + ((price.high - price.open)*scale.scaleY)),
        xy(xyOrigin.x-5, xyOrigin.y + ((price.high - price.open)*scale.scaleY)),
        xy(xyOrigin.x, xyOrigin.y + ((price.high - price.open)*scale.scaleY)),
        xy(xyOrigin.x, xyOrigin.y + ((price.high - price.close)*scale.scaleY)),
        xy(xyOrigin.x+5, xyOrigin.y + ((price.high - price.close)*scale.scaleY)),
        xy(xyOrigin.x, xyOrigin.y + ((price.high - price.close)*scale.scaleY)),
        xy(xyOrigin.x, xyOrigin.y + ((price.high - price.low)*scale.scaleY)),
    ];
    const pointCalc = point.filter(p => !!p.x && !!p.y)
        .map(p => `${p.x},${p.y}`)
        .join(" ");
    return (<polyline key={idx} points={pointCalc} style={ price.open < price.close ? polyLineGreenStyle : polyLineRedStyle} />);
}

function xy(px: number = 0, py: number = 0): IPoint {
    return {x: px, y: py};
}

function AxisDraw(scale: IPriceXYScale) {
    return (
        <g>
            <path stroke="gray" d="M 90 550 H 800 Z" />
            <path stroke="gray" d="M 90 50 V 550 Z" />
        </g>
    );
}