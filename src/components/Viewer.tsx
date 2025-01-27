/* eslint-disable @typescript-eslint/no-explicit-any */
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

const buildDataArray = (series: ViewerType[], dataKey: keyof ValuesType) => {
    const dateKey = 'date';
    const merged: any[] = [];
    const nullObj: any = {
        [dateKey]: null,
    };

    series.forEach((s) => {
        merged.push(
            ...s.values.map((v) => {
                return {
                    [dateKey]: v[dateKey],
                    [s.label]: v[dataKey],
                };
            })
        );
        nullObj[s.label] = null;
    });

    const res: any[] = [];
    merged.forEach((e) => {
        const match = res.find((r) => r[dateKey] === e[dateKey]);
        if (match) {
            Object.assign(match, e);
        } else {
            res.push(e);
        }
    });

    return res.sort((a, b) => {
        if (a[dateKey] > b[dateKey]) {
            return 1;
        }
        if (a[dateKey] < b[dateKey]) {
            return -1;
        }
        return 0;
    });
};

const Viewer = (props: ViewerProps) => {
    const { dataKey, series } = props;

    return (
        <ResponsiveContainer width="99%" height="100%" aspect={2.5}>
            <LineChart
                width={400}
                height={400}
                data={buildDataArray(series, dataKey)}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    domain={['dataMin', 'dataMax']}
                    padding={{ left: 30, right: 30 }}
                    interval="preserveStartEnd"
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
                        dataKey={s.label}
                        name={s.label}
                        key={s.label}
                        stroke={s.stroke}
                        dot={false}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default Viewer;
