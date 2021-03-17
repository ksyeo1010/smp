import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

import { ValuesType } from '../store/dataset/types';

export interface ViewerType {
    label: string;
    stroke: string;
    values: ValuesType[];
}

interface ViewerProps {
    dataKey: keyof ValuesType;
    series: ViewerType[];
}

const Viewer = (props: ViewerProps) => {
    const { dataKey, series } = props;

    return (
        <ResponsiveContainer width="99%" height="100%" aspect={2.5}>
            <LineChart width={400} height={400}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    domain={['dataMin', 'dataMax']}
                    padding={{ left: 30, right: 30 }}
                    interval={10}
                />
                <YAxis
                    domain={[
                        (dataMin: number) =>
                            Math.max(Math.round(dataMin) - 10, 0),
                        (dataMax: number) => Math.round(dataMax) + 10,
                    ]}
                    type="number"
                    allowDecimals={false}
                />
                <Tooltip />
                <Legend />
                {series.map((s) => (
                    <Line
                        dataKey={dataKey}
                        data={s.values}
                        name={s.label}
                        key={s.label}
                        stroke={s.stroke}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default Viewer;
