import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useParams } from 'react-router-dom';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
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

import Viewer, { ViewerType } from './Viewer';
import { thunkGetDataset } from '../thunks';
import { RootState } from '../store';
import { ValuesType } from '../store/dataset/types';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: '100%',
        },
        paper: {
            padding: theme.spacing(2),
        },
    })
);

const mapState = (state: RootState) => ({
    dataset: state.dataset,
});

const mapDispatch = {
    getDataset: thunkGetDataset,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

interface ParamType {
    symbol: string;
}

const DataPage = (props: Props) => {
    const classes = useStyles();
    const { symbol } = useParams<ParamType>();
    const { dataset, getDataset } = props;
    const { selected } = dataset;
    const values = selected ? selected.values : undefined;

    const [indicator, setIndicator] = useState<keyof ValuesType>('open');
    const [dateRange, setDateRange] = useState(100);

    useEffect(() => {
        getDataset(symbol, dateRange);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={classes.root}>
            {selected && values && (
                <Paper className={classes.paper}>
                    <Viewer
                        dataKey="open"
                        series={[{ label: 'real', stroke: '#8884d8', values }]}
                    />
                </Paper>
            )}
        </div>
    );
};

export default connector(DataPage);
