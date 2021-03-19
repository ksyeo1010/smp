import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Typography, Popover } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import PageviewIcon from '@material-ui/icons/Pageview';
import UpdateIcon from '@material-ui/icons/Update';

import DataTable, { HeadCell } from './DataTable';
import { thunkGetDatasets } from '../thunks';
import { RootState } from '../store';

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

const headCells: HeadCell[] = [
    { id: 'symbol', label: 'Symbol', align: 'left' },
    { id: 'modified', label: 'Last Updated', align: 'right' },
    { id: 'size', label: 'Size (KB)', align: 'right' },
];

const Datasets = (props: Props) => {
    const classes = useStyles();
    const { dataset, getDatasets } = props;
    const history = useHistory();

    useEffect(() => {
        getDatasets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const Icons = (iprops: IconProps) => {
        const [anchorEl, setAnchorEl] = useState<SVGSVGElement | null>(null);
        const [anchorLabel, setAnchorLabel] = useState('');
        const { symbol } = iprops;

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

    return (
        <div>
            <DataTable
                data={dataset.files}
                headCells={headCells}
                Icons={Icons}
            />
        </div>
    );
};

export default connector(Datasets);
