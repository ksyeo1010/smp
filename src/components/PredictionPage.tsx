import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useParams, useLocation } from 'react-router';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import {
    Paper,
    Typography,
    Grid,
    TextField,
    RadioGroup,
    Radio,
    FormControlLabel,
} from '@material-ui/core';

import Viewer from './Viewer';
import { thunkGetDataset, thunkGetPrediction } from '../thunks';
import { RootState } from '../store';
import { ValuesType } from '../store/prediction/types';

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
    prediction: state.prediction,
});

const mapDispatch = {
    getDataset: thunkGetDataset,
    getPrediction: thunkGetPrediction,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

interface ParamType {
    uuid: string;
}

const PredictionPage = (props: Props) => {
    const classes = useStyles();
    const { uuid } = useParams<ParamType>();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const symbol = query.get('symbol');

    const { dataset, prediction, getDataset, getPrediction } = props;
    const { selected, error, message } = dataset;
    const values = selected ? selected.values : [];

    const selPred = prediction.selected;
    const [predictions, forecast] = selPred
        ? [selPred.predictions, selPred.forecast]
        : [undefined, undefined];

    const [indicator, setIndicator] = useState<keyof ValuesType>('open');
    const [dateRange, setDateRange] = useState(100);

    useEffect(() => {
        getPrediction(uuid, dateRange);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        getDataset(symbol!, dateRange);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateRange]);

    return (
        <div className={classes.root}>
            {values && selPred && predictions && forecast && (
                <Paper className={classes.paper}>
                    {error && (
                        <Alert severity="warning">
                            <AlertTitle>Warning</AlertTitle>
                            {message}
                        </Alert>
                    )}
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="h5">{symbol}</Typography>
                        </Grid>
                    </Grid>
                    <Viewer
                        dataKey={indicator}
                        series={[
                            { label: 'real', stroke: '#8884d8', values },
                            {
                                label: 'pred',
                                stroke: '#82ca9d',
                                values: predictions,
                            },
                            {
                                label: 'forecast',
                                stroke: '#217047',
                                values: forecast,
                            },
                        ]}
                    />
                    <Grid container>
                        <Grid item md={4}>
                            <Grid container justify="center">
                                <TextField
                                    label="Number of days"
                                    type="number"
                                    variant="outlined"
                                    defaultValue={dateRange}
                                    onChange={(e) =>
                                        setDateRange(Number(e.target.value))
                                    }
                                />
                            </Grid>
                        </Grid>
                        <Grid item md={8}>
                            <Grid container justify="center">
                                <RadioGroup
                                    row
                                    value={indicator}
                                    onChange={(e) =>
                                        setIndicator(
                                            e.target.value as keyof ValuesType
                                        )
                                    }
                                >
                                    {['open', 'high', 'low', 'close'].map(
                                        (k) => (
                                            <FormControlLabel
                                                key={k}
                                                value={k}
                                                control={<Radio />}
                                                label={k}
                                            />
                                        )
                                    )}
                                </RadioGroup>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            )}
        </div>
    );
};

export default connector(PredictionPage);
