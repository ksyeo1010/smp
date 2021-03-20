import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Typography, Popover } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import PageviewIcon from '@material-ui/icons/Pageview';

import DataTable, { HeadCell, RowCell } from './DataTable';
import { thunkGetPredictions } from '../thunks';
import { RootState } from '../store';

import { PredictionType } from '../store/prediction/types';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        icon: {
            marginLeft: theme.spacing(1),
            color: 'grey',
            '&:hover': {
                cursor: 'pointer',
                color: 'black',
            },
        },
        paper: {
            padding: theme.spacing(1),
        },
        popover: {
            pointerEvents: 'none',
        },
    })
);

const mapState = (state: RootState) => ({
    prediction: state.prediction,
});

const mapDispatch = {
    getPredictions: thunkGetPredictions,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

interface IconProps {
    uuid: string;
    symbol: string;
}

const Icons = (props: IconProps) => {
    const classes = useStyles();
    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState<SVGSVGElement | null>(null);
    const [anchorLabel, setAnchorLabel] = useState('');
    const { uuid, symbol } = props;

    const handlePopoverOpen = (
        event: React.MouseEvent<SVGSVGElement, MouseEvent>,
        label: string
    ) => {
        setAnchorEl(event.currentTarget);
        setAnchorLabel(label);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setAnchorLabel('');
    };

    const handleViewClick = () => {
        history.push(`/predictions/${uuid}?symbol=${symbol}`);
    };

    return (
        <div>
            <PageviewIcon
                className={classes.icon}
                onMouseEnter={(e) => {
                    handlePopoverOpen(e, 'View Model');
                }}
                onMouseLeave={handlePopoverClose}
                onClick={handleViewClick}
            />
            <DeleteIcon
                className={classes.icon}
                onMouseEnter={(e) => {
                    handlePopoverOpen(e, 'Delete Model');
                }}
                onMouseLeave={handlePopoverClose}
            />
            <Popover
                id="mouse-over-popover"
                className={classes.popover}
                classes={{
                    paper: classes.paper,
                }}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography>{anchorLabel}</Typography>
            </Popover>
        </div>
    );
};

const headCells: HeadCell<PredictionType>[] = [
    { id: 'symbol', label: 'Symbol', align: 'left', order: true },
    { id: 'predicted_at', label: 'Predicted At', align: 'right', order: true },
    { id: 'icons', label: 'Actions', align: 'right', order: false },
];

const rowCells: RowCell<PredictionType>[] = [
    { id: 'symbol', key: 'symbol', align: 'left' },
    { id: 'predicted_at', key: 'predicted_at', align: 'right' },
    {
        id: 'icons',
        key: 'uuid',
        align: 'right',
        input: ['uuid', 'symbol'],
        apply: function renderIcons([uuid, symbol]) {
            return <Icons uuid={uuid} symbol={symbol} />;
        },
    },
];

const Predictions = (props: Props) => {
    const { prediction, getPredictions } = props;

    useEffect(() => {
        getPredictions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <DataTable<PredictionType>
                data={prediction.preds}
                headCells={headCells}
                rowCells={rowCells}
                primaryKey="symbol"
                uniqueKey="uuid"
            />
        </div>
    );
};

export default connector(Predictions);
