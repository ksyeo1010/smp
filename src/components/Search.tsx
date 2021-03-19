import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TextField, CircularProgress } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

import { thunkSaveDataset } from '../thunks';
import { RootState } from '../store';
import { bytesToKB } from '../utils';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '100%',
            },
        },
        hover: {
            '&:hover': {
                cursor: 'pointer',
            },
        },
    })
);

const mapState = (state: RootState) => ({
    dataset: state.dataset,
});

const mapDispatch = {
    saveDataset: thunkSaveDataset,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

const Search = (props: Props) => {
    const classes = useStyles();
    const { dataset, saveDataset } = props;
    const { selected, success, loading, error, message } = dataset;

    const [symbol, setSymbol] = React.useState('');

    const handleForm = (e: React.FormEvent) => {
        saveDataset(symbol);
        e.preventDefault();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSymbol(e.target.value);
    };

    return (
        <div>
            <form
                className={classes.root}
                onSubmit={handleForm}
                noValidate
                autoComplete="off"
            >
                <TextField
                    error={error}
                    label="Enter Symbol"
                    variant="filled"
                    onChange={handleChange}
                    InputProps={{
                        endAdornment: !loading ? (
                            <CloudDownloadIcon
                                className={classes.hover}
                                onClick={handleForm}
                            />
                        ) : (
                            <CircularProgress />
                        ),
                    }}
                />
            </form>
            <div className={classes.root}>
                {success && selected && (
                    <Alert severity="success">
                        <AlertTitle>Success</AlertTitle>
                        Successfully downloaded {selected.symbol} with size{' '}
                        {bytesToKB(selected.size)} KB.
                    </Alert>
                )}
                {error && (
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {message}
                    </Alert>
                )}
            </div>
        </div>
    );
};

export default connector(Search);
