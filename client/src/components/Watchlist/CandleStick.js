import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

const CandleStick = props => {
    const {
        data,
        colors: {
            backgroundColor = 'white',
            lineColor = '#2962FF',
            textColor = 'black',
            areaTopColor = '#2962FF',
            areaBottomColor = 'rgba(41, 98, 255, 0.28)',
        } = {},
    } = props;

    const chartContainerRef = useRef();

    useEffect(() => {
        const handleResize = () => {
            chart.applyOptions({
                width: chartContainerRef.current.clientWidth,
            });
        };

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
            },
            width: chartContainerRef.current.clientWidth,
            height: 300,
        });

        const candlestickSeries = chart.addCandlestickSeries({
            upColor: 'rgba(38, 166, 154, 1)',
            downColor: 'rgba(239, 83, 80, 1)',
            borderVisible: false,
            wickUpColor: 'rgba(38, 166, 154, 1)',
            wickDownColor: 'rgba(239, 83, 80, 1)',
        });

        const volumeSeries = chart.addHistogramSeries({
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: '',
            scaleMargins: {
                top: 0.7,
                bottom: 0,
            },
        });

        volumeSeries.priceScale().applyOptions({
            scaleMargins: {
                top: 0.7,
                bottom: 0,
            },
        });

        candlestickSeries.setData(data.priceData);
        volumeSeries.setData(data.volumeData);

        chart.timeScale().fitContent();
        chart.timeScale().applyOptions({
            timeVisible: true,
        });

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);

            chart.remove();
        };
    }, [
        data,
        backgroundColor,
        lineColor,
        textColor,
        areaTopColor,
        areaBottomColor,
    ]);

    return <div ref={chartContainerRef} />;
};

export default CandleStick;
