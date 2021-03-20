import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Typography, Popover } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import PageviewIcon from '@material-ui/icons/Pageview';
import UpdateIcon from '@material-ui/icons/Update';

import DataTable, { HeadCell, RowCell } from './DataTable';
import { thunkGetDatasets } from '../thunks';
import { RootState } from '../store';

import { FileType } from '../store/dataset/types';
import { bytesToKB } from '../utils';

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
    dataset: state.dataset,
});

const mapDispatch = {
    getDatasets: thunkGetDatasets,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

interface IconProps {
    symbol: string;
}

const Icons = (props: IconProps) => {
    const classes = useStyles();
    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState<SVGSVGElement | null>(null);
    const [anchorLabel, setAnchorLabel] = useState('');
    const { symbol } = props;

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
        history.push(`/datasets/${symbol}`);
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
            <UpdateIcon
                className={classes.icon}
                onMouseEnter={(e) => {
                    handlePopoverOpen(e, 'Update Model');
                }}
                onMouseLeave={handlePopoverClose}
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

const headCells: HeadCell<FileType>[] = [
    { id: 'symbol', label: 'Symbol', align: 'left', order: true },
    { id: 'modified', label: 'Last Updated', align: 'right', order: true },
    { id: 'size', label: 'Size (KB)', align: 'right', order: true },
    { id: 'icons', label: 'Actions', align: 'right', order: false },
];

const rowCells: RowCell<FileType>[] = [
    { id: 'symbol', key: 'symbol', align: 'left' },
    { id: 'modified', key: 'modified', align: 'right' },
    {
        id: 'size',
        key: 'size',
        align: 'right',
        input: ['size'],
        apply: ([size]) => bytesToKB(size),
    },
    {
        id: 'icons',
        key: 'symbol',
        align: 'right',
        input: ['symbol'],
        apply: function renderIcons([input]) {
            return <Icons symbol={input} />;
        },
    },
];

const Datasets = (props: Props) => {
    const { dataset, getDatasets } = props;

    useEffect(() => {
        getDatasets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <DataTable<FileType>
                data={dataset.files}
                headCells={headCells}
                rowCells={rowCells}
                primaryKey="symbol"
                uniqueKey="symbol"
            />
        </div>
    );
};

export default connector(Datasets);
