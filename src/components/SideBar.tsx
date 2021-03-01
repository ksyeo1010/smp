import React from 'react';
import { useHistory } from 'react-router-dom';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import {
    Drawer,
    CssBaseline,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@material-ui/core';

export type RouteType = {
    path: string;
    text: string;
    exact: boolean;
    icon: React.ReactElement;
    component: React.ComponentType;
};

type Props = {
    mainRoutes: RouteType[];
    sideRoutes: RouteType[];
};

const drawerWidth = 220;

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        // necessary for content to be below app bar
        toolbar: theme.mixins.toolbar,
        content: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.default,
            padding: theme.spacing(3),
        },
    })
);

export default function PermanentDrawerLeft(props: Props) {
    const classes = useStyles();
    const history = useHistory();

    const { mainRoutes, sideRoutes } = props;

    const [curr, setCurr] = React.useState(mainRoutes[0].text);

    const handleRoute = (route: RouteType) => {
        history.push(route.path);
        setCurr(route.text);
    };

    return (
        <div>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        {curr}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left"
            >
                <div className={classes.toolbar} />
                <Divider />
                <List>
                    {mainRoutes.map((route) => (
                        <ListItem
                            button
                            key={route.text}
                            onClick={() => handleRoute(route)}
                        >
                            <ListItemIcon>{route.icon}</ListItemIcon>
                            <ListItemText primary={route.text} />
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {sideRoutes.map((route) => (
                        <ListItem
                            button
                            key={route.text}
                            onClick={() => handleRoute(route)}
                        >
                            <ListItemIcon>{route.icon}</ListItemIcon>
                            <ListItemText primary={route.text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </div>
    );
}
