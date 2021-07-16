import React from 'react';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryStack, VictoryTheme } from 'victory';

export function ResultCharts(props) {

    return (
        <VictoryChart theme={VictoryTheme.material} domainPadding={20} height={210}>
            <VictoryAxis tickValues={[1,2,3,4]} tickFormat={["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]}/>
            <VictoryAxis dependentAxis tickFormat={x => (`$${x /100}k`)}/>
            <VictoryStack colorScale={"warm"}>
                <VictoryBar data={props.data} x="quarter" y="earnings"/>
            </VictoryStack>
        </VictoryChart>
    )
}