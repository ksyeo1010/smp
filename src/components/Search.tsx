import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TextField, CircularProgress } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

import { thunkSaveDataset } from '../thunks';
import { RootState } from '../store';

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
    const { loading, error, message } = dataset;

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
                    helperText={error ? message : ''}
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
        </div>
    );
};

export default connector(Search);
