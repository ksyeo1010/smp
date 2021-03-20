/* eslint-disable @typescript-eslint/no-explicit-any */
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

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
): (
    a: { [key in Key]: number | string | unknown },
    b: { [key in Key]: number | string | unknown }
) => number {
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

export interface HeadCell<T> {
    id: keyof T | string;
    label: string;
    align: 'left' | 'right';
    order: boolean;
}

export interface RowCell<T> {
    id: keyof T | string;
    key: keyof T;
    align: 'left' | 'right';
    input?: any[];
    apply?(input: any): any;
}

interface DataTableHeadProps<T> {
    classes: ReturnType<typeof useStyles>;
    headCells: HeadCell<T>[];
    onRequestSort: (
        event: React.MouseEvent<unknown>,
        property: keyof T
    ) => void;
    order: Order;
    orderBy: string;
    showIndex: boolean;
}

const DataTableHead = <T extends any>(props: DataTableHeadProps<T>) => {
    const {
        classes,
        headCells,
        onRequestSort,
        order,
        orderBy,
        showIndex,
    } = props;
    const createSortHandler = (property: keyof T) => (
        event: React.MouseEvent<unknown>
    ) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {showIndex ? <TableCell>#</TableCell> : null}
                {headCells.map((hc) =>
                    hc.order ? (
                        <TableCell
                            key={hc.id as string}
                            align={hc.align}
                            sortDirection={orderBy === hc.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === hc.id}
                                direction={hc.id ? order : 'asc'}
                                onClick={createSortHandler(hc.id as keyof T)}
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
                    ) : (
                        <TableCell key={hc.id as string} align={hc.align}>
                            {hc.label}
                        </TableCell>
                    )
                )}
            </TableRow>
        </TableHead>
    );
};

interface DataTableProps<T> {
    data: T[];
    headCells: HeadCell<T>[];
    rowCells: RowCell<T>[];
    primaryKey: keyof T;
    uniqueKey: keyof T;
    showIndex?: boolean;
}

const DataTable = <T extends any>(props: DataTableProps<T>) => {
    const classes = useStyles();
    const {
        data,
        headCells,
        rowCells,
        showIndex,
        primaryKey,
        uniqueKey,
    } = props;

    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof T>(primaryKey);

    const handleRequestSort = (
        _event: React.MouseEvent<unknown>,
        property: keyof T
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
                        <DataTableHead<T>
                            classes={classes}
                            order={order}
                            orderBy={orderBy as string}
                            onRequestSort={handleRequestSort}
                            headCells={headCells}
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            showIndex={showIndex!}
                        />
                        <TableBody>
                            {stableSort(
                                data as T[],
                                getComparator(order, orderBy)
                            ).map((row, index) => {
                                return (
                                    <TableRow
                                        key={String(row[uniqueKey])}
                                        hover
                                    >
                                        {showIndex ? (
                                            <TableCell>{index}</TableCell>
                                        ) : null}
                                        {rowCells.map((rc) => (
                                            <TableCell
                                                align={rc.align}
                                                key={rc.id as string}
                                            >
                                                {rc.apply && rc.input
                                                    ? rc.apply(
                                                          rc.input.map(
                                                              (i) =>
                                                                  row[
                                                                      i as keyof T
                                                                  ]
                                                          )
                                                      )
                                                    : row[rc.key as keyof T]}
                                            </TableCell>
                                        ))}
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

DataTable.defaultProps = {
    showIndex: true,
};

export default DataTable;
