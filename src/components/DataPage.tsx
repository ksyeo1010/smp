import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useParams } from 'react-router-dom';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
    Paper,
    Typography,
    Grid,
    Button,
    TextField,
    RadioGroup,
    Radio,
    FormControlLabel,
} from '@material-ui/core';

import Viewer from './Viewer';
import { thunkGetDataset, thunkPredict } from '../thunks';
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
    predict: thunkPredict,
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
    const { dataset, getDataset, predict } = props;
    const { selected } = dataset;
    const values = selected ? selected.values : undefined;

    const [indicator, setIndicator] = useState<keyof ValuesType>('open');
    const [dateRange, setDateRange] = useState(100);

    useEffect(() => {
        getDataset(symbol, dateRange);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateRange]);

    return (
        <div className={classes.root}>
            {selected && values && (
                <Paper className={classes.paper}>
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography variant="h5">
                                {selected.symbol}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Grid container justify="flex-end">
                                <Button
                                    variant="contained"
                                    onClick={() => predict(symbol)}
                                >
                                    Predict
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Viewer
                        dataKey={indicator}
                        series={[{ label: 'real', stroke: '#8884d8', values }]}
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

export default connector(DataPage);
