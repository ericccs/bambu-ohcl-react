import * as React from 'react';
import './app-ohlc-chart.css';
import {
    IAppOhlcChartProps,
    IAppOhlcChartState,
    IPoint,
    ITimeSeriesData,
    IPriceItem,
    IPriceXYScale
} from "./app-types";


class AppOhlcChart extends React.Component<IAppOhlcChartProps, IAppOhlcChartState> {

    // constructor(props: IAppOhlcChartProps) {
    //     super(props);
    // }

    public render() {
        const scale: IPriceXYScale = this.calculatePriceScale(this.props.timeSeriesData);
        const prices: IPriceItem[] = this.props.timeSeriesData.timeSeriesList;
        // const prices: IPriceItem[] = [{
        //     timeKey: "2018-08-01",
        //     open: 100,
        //     high: 120,
        //     low: 50,
        //     close: 70,
        //     volume: 100000
        // }, {
        //     timeKey: "2018-08-01",
        //     open: 170,
        //     high: 200,
        //     low: 150,
        //     close: 180,
        //     volume: 100000
        // }];

        const ohlcChart = prices.map((price, idx) => OhlcSymbol(price, scale, idx));
        return (
            <svg className="graph-canvas-container">
                {ohlcChart}

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
        // console.log("priceSample: ", priceSample);

        const minPrice: number = Math.floor(Math.min(...priceSample));
        const maxPrice: number = Math.floor(Math.max(...priceSample)) + 1;

        const range: number = maxPrice - minPrice;

        console.log("minPrice: ", minPrice);
        console.log("maxPrice: ", maxPrice);
        console.log("range: ", range);

        const scale: IPriceXYScale = {
            originX: 100,
            originY: 500,
            scaleX: 10,
            scaleY: 20
        };
        return scale;
    }
}

export default AppOhlcChart;


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
    const xyOrigin: IPoint = xy(scale.originX + (idx * scale.scaleX), scale.originY-((price.high-87)*scale.scaleY));
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
        // .map(p => {
        //     p.x = !!p.x ? p.x: 0;
        //     p.y = !!p.y ? p.y : 0;
        //     return p;
        // })
        .map(p => `${p.x},${p.y}`)
        .join(" ");
    return (<polyline key={idx} points={pointCalc} style={ price.open < price.close ? polyLineGreenStyle : polyLineRedStyle} />);
}

function xy(px: number = 0, py: number = 0): IPoint {
    return {x: px, y: py};
}

function PolylineChart() {
    return (<polyline points="200,92.43 250,300.123" style={polyLineGreenStyle} />);
}