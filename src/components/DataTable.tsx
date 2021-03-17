import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
    Paper,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableSortLabel,
    TableContainer,
} from '@material-ui/core';

import { FileType } from '../store/dataset/types';
import { bytesToKB } from '../utils';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        paper: {
            width: '100%',
            marginBottom: theme.spacing(2),
        },
        table: {
            minWidth: 750,
        },
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
    })
);

type DataType = FileType;
type Order = 'asc' | 'desc';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator<Key extends keyof DataType>(
    order: Order,
    orderBy: Key
): (a: DataType, b: DataType) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export interface HeadCell {
    id: keyof DataType;
    label: string;
    align: 'left' | 'right';
}

interface DataTableHeadProps {
    classes: ReturnType<typeof useStyles>;
    headCells: HeadCell[];
    onRequestSort: (
        event: React.MouseEvent<unknown>,
        property: keyof DataType
    ) => void;
    order: Order;
    orderBy: string;
}

const DataTableHead = (props: DataTableHeadProps) => {
    const { classes, headCells, onRequestSort, order, orderBy } = props;
    const createSortHandler = (property: keyof DataType) => (
        event: React.MouseEvent<unknown>
    ) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell>#</TableCell>
                {headCells.map((hc) => (
                    <TableCell
                        key={hc.id}
                        align={hc.align}
                        sortDirection={orderBy === hc.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === hc.id}
                            direction={hc.id ? order : 'asc'}
                            onClick={createSortHandler(hc.id)}
                        >
                            {hc.label}
                            {orderBy === hc.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc'
                                        ? 'sorted descending'
                                        : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell align="right">Actions</TableCell>
            </TableRow>
        </TableHead>
    );
};

interface DataTableProps {
    data: DataType[];
    headCells: HeadCell[];
    Icons: React.ElementType;
}

const DataTable = (props: DataTableProps) => {
    const classes = useStyles();
    const { data, headCells, Icons } = props;

    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof FileType>('name');

    const handleRequestSort = (
        _event: React.MouseEvent<unknown>,
        property: keyof DataType
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <TableContainer>
                    <Table className={classes.table}>
                        <DataTableHead
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            headCells={headCells}
                        />
                        <TableBody>
                            {stableSort(
                                data,
                                getComparator(order, orderBy)
                            ).map((row, index) => {
                                return (
                                    <TableRow key={row.name} hover>
                                        <TableCell align="left">
                                            {index}
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            align="left"
                                        >
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.modified}
                                        </TableCell>
                                        <TableCell align="right">
                                            {bytesToKB(row.size)}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Icons symbol={row.name} />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
};

export default DataTable;
