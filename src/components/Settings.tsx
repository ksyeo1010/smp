import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Paper, Typography, Grid, TextField, Button } from '@material-ui/core';

import {
    thunkChangeSettings,
    thunkGetSettings,
    thunkUpdateSettings,
} from '../thunks';
import { RootState } from '../store';
import { OptionsType, SettingsType } from '../store/settings/types';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        paper: {
            width: '100%',
            marginBottom: theme.spacing(2),
        },
        header: {
            padding: theme.spacing(2),
        },
        rowItems: {
            padding: theme.spacing(1),
        },
        input: {
            width: '90%',
        },
        button: {
            padding: theme.spacing(2),
        },
    })
);

const mapState = (state: RootState) => ({
    settings: state.settings,
});

const mapDispatch = {
    getSettings: thunkGetSettings,
    updateSettings: thunkUpdateSettings,
    changeSettings: thunkChangeSettings,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

const Settings = (props: Props) => {
    const classes = useStyles();
    const { settings, getSettings, updateSettings, changeSettings } = props;
    const { values } = settings;

    useEffect(() => {
        getSettings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleInputChange = (
        section: keyof SettingsType,
        option: keyof OptionsType,
        value: string | number
    ) => {
        changeSettings(section, option, value);
    };

    const renderSettings = (key: keyof SettingsType) => {
        const options = values[key];

        return (
            <Grid container>
                {options &&
                    Object.entries(options).map(
                        ([opt, value]: [string, string | number]) => (
                            <Grid
                                container
                                direction="row"
                                alignItems="center"
                                key={opt}
                            >
                                <Grid item xs={12} md={4}>
                                    <Grid
                                        container
                                        justify="center"
                                        className={classes.rowItems}
                                    >
                                        <Typography>
                                            {opt.toUpperCase()}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={8}>
                                    <Grid
                                        container
                                        justify="center"
                                        className={classes.rowItems}
                                    >
                                        <TextField
                                            variant="outlined"
                                            defaultValue={value}
                                            type={typeof value}
                                            size="small"
                                            className={classes.input}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    key,
                                                    opt,
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        )
                    )}
            </Grid>
        );
    };

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <Typography variant="h5" className={classes.header}>
                    Alpha Vantage
                </Typography>
                {renderSettings('alpha_vantage' as keyof SettingsType)}
                <Typography variant="h5" className={classes.header}>
                    Predictions
                </Typography>
                {renderSettings('prediction')}
                <Grid container justify="flex-end" className={classes.button}>
                    <Button
                        variant="contained"
                        size="large"
                        color="primary"
                        onClick={() => updateSettings(values)}
                    >
                        Save Changes
                    </Button>
                </Grid>
            </Paper>
        </div>
    );
};

export default connector(Settings);
