'use client';

import { CanvasCharts, Grid, Legend, LineSeries, Tooltip, XAxis, YAxis } from 'echarts-jsx';
import { FC } from 'react';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const DashboardChart: FC = () => (
    <CanvasCharts className="my-4 w-100">
        <Grid left={48} right={24} top={24} bottom={48} />
        <Legend data={['This year', 'Last year']} />
        <Tooltip trigger="axis" />
        <XAxis data={days} boundaryGap={false} />
        <YAxis />
        <LineSeries
            name="This year"
            data={[15339, 21345, 18483, 24003, 23489, 24092, 12034]}
            showSymbol={false}
            lineStyle={{ width: 2 }}
        />
        <LineSeries
            name="Last year"
            data={[10345, 15339, 14003, 19034, 18023, 19456, 10345]}
            showSymbol={false}
            lineStyle={{ width: 2 }}
        />
    </CanvasCharts>
);

DashboardChart.displayName = 'DashboardChart';
