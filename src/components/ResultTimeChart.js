import { TimeSeries, avg } from 'pondjs';
import React from 'react';
import {
    Charts,
    ChartContainer,
    ChartRow,
    YAxis,
    BarChart,
    Resizable
} from "react-timeseries-charts";

export function ResultTimeChart(props) {

    if (! props.data || props.data.length === 0)
        return (<h2>No data</h2>);

//console.log(JSON.stringify(props.data));
/*
    const series = new TimeSeries({
        name: "Translation success",
        columns: ["index", "success"],
        points: props.data.map((rec) => [
            Index.getIndexString("1h", new Date(rec._id)),
            rec.wasCorrect ? 1 : 0
            //rec.value
        ])
    });
*/   

    let series = new TimeSeries({
        name: "hilo_rainfall",
        columns: ["time", "success"],
        points: props.data.map((rec) => [
            new Date(rec._id),
            rec.wasCorrect ? 100 : 0
        ])
    });
    
    let dailySeries = series.dailyRollup({
        aggregation: {success: {success: avg()}},
        toTimeEvents: false 
    })

    //const style = styler([
    //    { key: "success", color: "#A5C8E1"},
    //]);

    //console.log(JSON.stringify(dailySeries));

    return (
        <Resizable>
        <ChartContainer timeRange={dailySeries ? dailySeries.range(): null} 
                    title="Your success rate over the last days" 
                    format="day" 
                    utc={false}
                    padding ={0}>
            <ChartRow height="130">
                <YAxis
                    id="success"
                    label="rate %"
                    min={0}
                    max={110}
                    //format=".2f"
                    //width="70"
                    type="linear"
                />
                <Charts>
                    <BarChart
                        axis="success"
                        style={{success: {normal: {fill: "#e34d7d"}}}}
                        spacing={5}
                        columns={["success"]}
                        series={dailySeries}
                        //radius={5.0}
                    />
                </Charts>
            </ChartRow>
        </ChartContainer>
        </Resizable>
    );
}